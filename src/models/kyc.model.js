import mongoose from "mongoose";

const kycSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    applicantId: {
      type: String, // Sumsub applicantId
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },

    reviewResult: {
      type: String, // approved / rejected reason (optional)
    },
  },
  { timestamps: true }
);

export default mongoose.model("Kyc", kycSchema);
