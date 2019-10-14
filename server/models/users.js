import mongoose from "mongoose";
const { Schema } = mongoose;
var ObjectId = require("mongodb").ObjectID;
const ClientSchema = new Schema(
  {
    username: { type: String, required: true },
    profile_image:{type:String,requied:false},
    email: { type: String, required: true },
    password: { type: String, required: true },
    email_verified: { type: Boolean, required: false, default: false },
    address_is_available: { type: Boolean, required: true, default: false },
    address: {
      line: { type: String, required: false },
      city: { type: String, required: false },
      country: { type: String, required: false },
      zip: { type: String, required: false },
      required: false
    },
    phone: { type: String, required: false,default:''},
    phone_verified: { type: Boolean, required: false, default: false },
    phone_added: { type: Boolean, required: false, default: false },
    is_admin:{type:Boolean,required:false,default:false},
  },
  { timestamps: true, autoIndex: true }
);

ClientSchema.index;
const User = mongoose.model("users", ClientSchema);

export default User;
