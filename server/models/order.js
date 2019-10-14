import mongoose from "mongoose";
const { Schema } = mongoose;


const orderSchema = new Schema(
    {
      buyer:{ type: Object, required: true },
      orderlist:[{type:Object, required:true}],
    },
    {timestamps: true, autoIndex: true}
);



const order= mongoose.model("order", orderSchema);

export default order;