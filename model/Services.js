
import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        unique:true,
        required:true
    },
    description:{
        type:String,
    },
    price:{
        type:Number,
    },
    duration:{
        type:Number,
    },
    category:{
        type:mongoose.Schema.Types.ObjectId,
        ref: "Category",
        required:true,
    },
    isActive: {
    type: Boolean,
    default: true,
    },

})

const Service = mongoose.model("Service",serviceSchema);

export default Service;