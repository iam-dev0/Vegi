import mongoose from "mongoose";
const { Schema } = mongoose;
const productSchema = new Schema(
  {
    title: { type: String, required: true },
    price: { type: Number, required: true },
    creater: { type: String, required: true },
    image: { type: String },
    quantity:{type:String}
  },
  { timestamps: true, autoIndex: true }
);

const Product = mongoose.model("products", productSchema);

export default Product;
