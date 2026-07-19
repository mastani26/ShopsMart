import mongoose from "mongoose";

const connectdb = async () => {
    try {

        console.log("Connecting to MongoDB...");

        await mongoose.connect(process.env.MONGODB_URI);

        console.log("✅ Database Connected");

    } catch (error) {

        console.error("❌ MongoDB Error:", error);

    }
};

export default connectdb;