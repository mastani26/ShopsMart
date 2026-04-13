import 'dotenv/config';
import cookieParser from 'cookie-parser';
import express from 'express';
import cors from 'cors';

import connectdb from './configs/db.js';
import connectcloudinary from './configs/cloudinary.js';

import UserRouter from './routes/UserRoute.js';
import sellerRouter from './routes/Sellerroute.js';
import productRouter from './routes/productroute.js';
import cartRouter from './routes/cartroute.js';
import addressRouter from './routes/addressroute.js';
import orderRouter from './routes/orderRoute.js';
import { stripeWebhooks } from './controllers/ordercontroller.js';

const app = express();
const port = process.env.PORT || 4000;

// DB + Cloudinary
await connectdb();
connectcloudinary();

// Allow multiple origins
const allowedOrigins = ['http://localhost:5173'];


app.post('/stripe',express.raw({type:'application/json'}),stripeWebhooks)

//Middleware configuration
app.use(express.json());
app.use(cookieParser());
app.use(cors({ origin: allowedOrigins, credentials: true }));

app.get('/', (req, res) => res.send("API is Working"));

// Routes
app.use('/api/user', UserRouter);
app.use('/api/seller', sellerRouter);
app.use('/api/product', productRouter);
app.use('/api/cart', cartRouter);
app.use('/api/address', addressRouter);
app.use('/api/order', orderRouter);

app.listen(port, () => {
  console.log(`Server is Running on http://localhost:${port}`);
});


console.log("ENV CHECK:",
  process.env.CLOUDINARY_API_KEY,
  process.env.CLOUDINARY_CLOUD_NAME
);
