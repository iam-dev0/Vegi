import mongoose from "mongoose";
const { Schema } = mongoose;
const productSchema = new Schema(
  {
    description: { type: String, required: true },
    // size: { type: String, required: true },
    // weight: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    //discount: { type: Number, required: true },
    //  on_sale: { type: Boolean, default: false },
    //  active: { type: Boolean, default:false },
    stock: { type: Number, required: true },
    category: { type: String },
    brand: { type: String },
    seller_id: { type: String, required: true },
    images: [{ type: String }],
    quantity: { type: Number, default: 0 }
  },
  { timestamps: true, autoIndex: true }
);

const Product = mongoose.model("products", productSchema);

export default Product;
