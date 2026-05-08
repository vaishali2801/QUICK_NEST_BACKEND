import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
    name:{
        type:String,
        trim:true,
        required:true,
        unique:true
    },
    description:{
        type:String,
    }
},
{
    timestamps:true,
    // toJSON: { virtual: true },
    // toObject: { virtual: true }
});
// categorySchema.virtual("services", {
//     ref: "Service",            // model name
//     localField: "_id",         // Category._id
//     foreignField: "category"   // Service.category
// });

const Category = mongoose.model("Category",categorySchema);

export default Category;