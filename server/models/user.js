import mongoose, { mongo } from "mongoose";

const userschema = new mongoose.Schema({
    name: {type:String, required:true},
    email:{type:String, required:true,unique:true},
    password:{type:String, required:true},
    cartitems: {
        type: Map,
        of: Number,
        default: {}
    }



},{minimize: false})

const user =mongoose.models.user || mongoose.model('user',userschema)

export default user