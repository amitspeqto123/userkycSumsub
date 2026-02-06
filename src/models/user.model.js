import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["USER", "ADMIN"],
      default: "USER",
    },
    kycStatus: {
      type: String,
      enum: ["NOT_STARTED", "PENDING", "APPROVED", "REJECTED"],
      default: "NOT_STARTED",
    },
  },
  { timestamps: true },
);

export default mongoose.model("User", userSchema);
