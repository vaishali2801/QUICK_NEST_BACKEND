
import mongoose from "mongoose";

const providerSchema = new mongoose.Schema({
    userId:{
        type :mongoose.Schema.Types.ObjectId,
        ref:"User"
    },
    services:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:"Service"
    },
    ],
    experience:{
        type:Number,
        default:0
    },
    documents:[
        {
            type:String,
        }
    ],
    document_cloudinary_id:{
        type:String,
    },
    isVerified:{
        type:Boolean,
        default:false
    }

})

const Provider = mongoose.model("Provider",providerSchema);
export default Provider;