
import mongoose from "mongoose";

const auditLogSchema = new mongoose.Schema({
    action:{
        type:String,
        required:true
    },
    performedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },
    module:{
        type:String,
        required:true
    },
    targetedId:{
        type:mongoose.Schema.Types.ObjectId,
        required:true
    },
    Ip:String,
    userAgent:String

},
{timestamps:true});

const auditLog = mongoose.model("auditLog",auditLogSchema);

export default auditLog;