import mongoose from "mongoose";
const { Schema } = mongoose;

const favoriteProductSchema = new Schema(
    {
      userid:{ type: String, required: true },
      product:{type:Object, required:true}
    },
    {timestamps: true, autoIndex: true}
);


const Favoriteproduct= mongoose.model("favoriteproduct", favoriteProductSchema);

export default Favoriteproduct;