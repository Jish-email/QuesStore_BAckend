import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  y_id: { type: String, required: true, unique: true },
  profilePic: { type: String, required: true }, // Cloudinary URL
  password: { type: String, required: true },
  contributeScore: { type: Number, default: 0 },
  token :{type:String},
  createdAt: { type: Date, default: Date.now },
});

userSchema.methods.generateRefreshToken = function () {
  return jwt.sign(
    {
      _id: this._id,

    },
    process.env.REFRESH_TOKEN_SECRET,
    {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY
    }
  )
}

export const User = mongoose.model("User", userSchema);
