import express from 'express'
import authUser from "../middleware/authUser.js";
import { updatecart } from "../controllers/cartcontroller.js";


const cartRouter = express.Router()

//end point
cartRouter.post('/update',authUser,updatecart)

export default cartRouter