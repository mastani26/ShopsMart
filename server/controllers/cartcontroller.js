import user from "../models/user.js";

export const updatecart = async (req, res) => {
  try {
    const userId = req.userId;   // ✅ correct
    const { cartitems } = req.body;

   

    if (!userId) {
      return res.json({ success: false, message: "No userId" });
    }

    await user.findByIdAndUpdate(userId, { cartitems });

    res.json({
      success: true,
      message: "Cart updated"
    });

  } catch (error) {
    console.log("ERROR:", error.message);
    res.json({ success: false, message: error.message });
  }
};
