import addressModel from "../models/address.js";

// Add address : /api/address/add
export const addaddress = async (req, res) => {
    try {
        const userId = req.userId;   // ✅ get from auth middleware
        const { address } = req.body;  // frontend sends address object

        if (!userId) {
            return res.json({ success: false, message: "User not authorized" });
        }

        // ✅ Save to DB
        await addressModel.create({
            ...address,
            userId
        });

        res.json({
            success: true,
            message: "Address added successfully"
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


// Get address list : /api/address/get
export const getaddress = async (req, res) => {
    try {
        const userId = req.userId;

        const addresses = await addressModel.find({ userId });

        res.json({
            success: true,
            addresses
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};
