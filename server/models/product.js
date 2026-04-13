import mongoose, { mongo } from "mongoose";
import { type } from "node:os";

const productSchema = new mongoose.Schema({
    name: {type:String, required:true},
    description:{type:Array, required:true},
    price:{type:Number, required:true},
    offerprice:{type:Number,required:true},
    image:{type:Array,required:true},
    category:{type:String,required:true},
    inStock:{type:Boolean,default:true},

},{timestamps:true})

const product =mongoose.models.product || mongoose.model('product',productSchema)

export default product