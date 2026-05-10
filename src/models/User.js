import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    username: {
      unique: true,
      type: String,
      required: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    number: {
      type: String,
      trim: true,
    },
    fullName: {
      type: String,
      trim: true,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
  },
  {
    timestamps: true,
  },
);

const User = mongoose.models.User || mongoose.model("User", userSchema);
export default User;
