import mongoose from "mongoose";
const { Schema } = mongoose;


const orderSchema = new Schema(
    {
      userId:{ type: String, required: true },
      product:{type:Object, required:true}
    },
    {timestamps: true, autoIndex: true}
);



const order= mongoose.model("card", orderSchema);

export default order;