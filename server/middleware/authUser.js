import jwt from 'jsonwebtoken';

const authUser = async (req, res, next) => {
    const { token } = req.cookies;

    if (!token) {
        return res.json({ success: false, message: 'Not authorized' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        req.userId = decoded.id;   // ✅ IMPORTANT

        next();

    } catch (error) {
        return res.json({ success: false, message: error.message });
    }
};

export default authUser;
