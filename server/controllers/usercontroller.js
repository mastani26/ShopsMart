import user from "../models/user.js";
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

// Register user : /api/user/register
export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.json({ success: false, message: 'Missing Details' });
        }

        const existinguser = await user.findOne({ email });

        if (existinguser) {
            return res.json({ success: false, message: 'User Already Exists' });
        }

        // Encrypt password
        const hashedpassword = await bcrypt.hash(password, 10);

        // Create user
        const newUser = await user.create({ name, email, password: hashedpassword });

        // Create token
        const token = jwt.sign(
            { id: newUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Send response
        return res.json({
            success: true,
            user: {
                name: newUser.name,
                email: newUser.email
            }
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};

//Login User : /api/user/login

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.json({ success: false, message: 'Email and Password are Required' });
        }

        // Find user
        const existingUser = await user.findOne({ email });

        if (!existingUser) {
            return res.json({ success: false, message: 'Invalid Email or Password' });
        }

        // Compare password
        const ismatch = await bcrypt.compare(password, existingUser.password);

        if (!ismatch) {
            return res.json({ success: false, message: 'Invalid Email or Password' });
        }

        // Generate token
        const token = jwt.sign(
            { id: existingUser._id },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'strict',
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // Send response
        return res.json({
            success: true,
            user: {
                name: existingUser.name,
                email: existingUser.email
            }
        });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


//Check whethe the user in authenticated or not   /api/user/is-auth

export const isAuth = async (req, res) => {
    try {
        const userId = req.userId;   // ✅ FIX 1

        const userData = await user.findById(userId).select("-password"); // ✅ FIX 2

        return res.json({ success: true, user: userData });

    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
};


//Logout user  : /api/user/logout
export const logout = async(req,res)=>{
    try {
        res.clearCookie('token',{
            httpOnly:true,
            secure:process.env.NODE_ENV === 'production',
            sameSite: process.env.NODE_ENV == 'production' ? 'none' :'strict',

        });

        return res.json({success:true,message:"Logged Out"})
    } catch (error) {
        console.log(error.message);
        res.json({ success: false, message: error.message });
    }
}
