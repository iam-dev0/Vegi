import mongoose from "mongoose";
const { Schema } = mongoose;


const orderSchema = new Schema(
    {
      buyer:{ type: Object, required: true },
      orderlist:[],
    },
    {timestamps: true, autoIndex: true}
);



const order= mongoose.model("order", orderSchema);

export default order;