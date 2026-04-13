import Product from "../models/product.js";
import Order from "../models/order.js";
import Stripe from "stripe";
import user from "../models/user.js"; // ✅ keep lowercase (no change in user.js)

// PLACE ORDER (COD)

export const placeOrderCOD = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, address } = req.body;

        // validate data
        if (!address || !items || items.length === 0) {
            return res.json({
                success: false,
                message: "Invalid Data"
            });
        }

        let amount = 0;

        // calculate total
        for (let item of items) {
            const productData = await Product.findById(item.productId);
            if (!productData) continue;

            amount += productData.offerprice * item.quantity;
        }

        // add 2% tax
        amount += Math.floor(amount * 0.02);

        // save order
        const order = await Order.create({
            userid: userId,
            items: items.map(i => ({
                productId: i.productId,
                quantity: i.quantity
            })),
            amount,
            address,
            paymenttype: "COD",
            ispaid: false
        });

        return res.json({
            success: true,
            message: "Order Placed Successfully",
            order
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};

// PLACE ORDER (STRIPE)
export const placeOrderStripe = async (req, res) => {
    try {
        const userId = req.userId;
        const { items, address } = req.body;
        const { origin } = req.headers;

        if (!address || !items || items.length === 0) {
            return res.json({
                success: false,
                message: "Invalid Data"
            });
        }

        let amount = 0;
        let productdatas = [];

        for (let item of items) {
            const productData = await Product.findById(item.productId);
            if (!productData) continue;

            amount += productData.offerprice * item.quantity;

            productdatas.push({
                name: productData.name,
                price: productData.offerprice,
                quantity: item.quantity,
            });
        }

        // add tax
        amount += Math.floor(amount * 0.02);

        // save order
        const order = await Order.create({
            userid: userId,
            items: items.map(i => ({
                productId: i.productId,
                quantity: i.quantity
            })),
            amount,
            address,
            paymenttype: "Online",
            ispaid: false
        });

        const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);

        // stripe items
        const line_items = productdatas.map(item => ({
            price_data: {
                currency: "inr",
                product_data: {
                    name: item.name,
                },
                unit_amount: Math.floor(item.price * 1.02 * 100),
            },
            quantity: item.quantity
        }));

        const session = await stripeInstance.checkout.sessions.create({
            line_items,
            mode: "payment",
            success_url: `${origin}/loader?next=my-orders`,
            cancel_url: `${origin}/cart`,
            metadata: {
                orderId: order._id.toString(),
                userId,
            }
        });

        return res.json({
            success: true,
            url: session.url
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};


// STRIPE WEBHOOK
export const stripeWebhooks = async (request, response) => {

    const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers["stripe-signature"];

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(
            request.body,
            sig,
            process.env.STRIPE_WEBHOOK_SECRET
        );
    } catch (error) {
        return response.status(400).send(`Webhook Error: ${error.message}`);
    }

    switch (event.type) {

        // payment success
        case "payment_intent.succeeded": {
            const paymentIntent = event.data.object;

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntent.id,
            });

            if (!session.data.length) break;

            const { orderId, userId } = session.data[0].metadata;

            // mark paid
            await Order.findByIdAndUpdate(orderId, { ispaid: true });

            // clear cart (IMPORTANT FIX HERE)
            await user.findByIdAndUpdate(userId, { cartitems: {} });

            break;
        }

        // payment failed
        case "payment_intent.payment_failed": {
            const paymentIntent = event.data.object;

            const session = await stripeInstance.checkout.sessions.list({
                payment_intent: paymentIntent.id,
            });

            if (!session.data.length) break;

            const { orderId } = session.data[0].metadata;

            // delete failed order
            await Order.findByIdAndDelete(orderId);

            break;
        }

        default:
            break;
    }

    response.json({ received: true });
};

// ✅ GET USER ORDERS
export const getuserOrders = async (req, res) => {
    try {
        const userId = req.userId;

        const orders = await Order.find({
            userid: userId,
            $or: [
                { paymenttype: "COD" },
                { ispaid: true }
            ]
        })
        .populate("items.productId")
        .populate("address")
        .sort({ createdAt: -1 });

        return res.json({
            success: true,
            orders
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};

// ✅ GET ALL ORDERS
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({
            $or: [
                { paymenttype: "COD" },
                { ispaid: true }
            ]
        })
        .populate("items.productId")
        .populate("address")
        .sort({ createdAt: -1 });

        return res.json({
            success: true,
            orders
        });

    } catch (error) {
        return res.json({
            success: false,
            message: error.message
        });
    }
};
