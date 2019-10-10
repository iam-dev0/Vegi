import mongoose from "mongoose";
const { Schema } = mongoose;


const cardSchema = new Schema(
    {
      userId:{ type: String, required: true },
      product:{type:Object, required:true}
    },
    {timestamps: true, autoIndex: true}
);



const card= mongoose.model("card", cardSchema);

export default card;