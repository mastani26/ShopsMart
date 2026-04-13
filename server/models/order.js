import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },

    items: [
        {
            productId: { 
                type: mongoose.Schema.Types.ObjectId,   // ✅ FIXED
                ref: 'product', 
                required: true 
            },
            quantity: { type: Number, required: true },
        }
    ],

    amount: { type: Number, required: true },

    address: { 
        type: mongoose.Schema.Types.ObjectId,  // ✅ FIXED
        ref: 'address', 
        required: true 
    },

    status: { type: String, default: 'Order placed' },

    paymenttype: { type: String, required: true },

    ispaid: { type: Boolean, default: false }

}, { timestamps: true });

const Order = mongoose.models.order || mongoose.model('order', orderSchema);

export default Order;
