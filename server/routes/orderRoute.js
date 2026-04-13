import express from 'express'
import authUser from '../middleware/authUser.js'
import { getAllOrders, getuserOrders, placeOrderCOD, placeOrderStripe } from '../controllers/ordercontroller.js';
import authseller from '../middleware/authseller.js'

const orderRouter = express.Router();

orderRouter.post('/cod',authUser,placeOrderCOD)
orderRouter.get('/user',authUser,getuserOrders)
orderRouter.get('/seller',authseller,getAllOrders)

orderRouter.post('/stripe',authUser,placeOrderStripe)

export default orderRouter