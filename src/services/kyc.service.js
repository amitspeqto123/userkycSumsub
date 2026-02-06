import Kyc from "../models/kyc.model.js";
import User from "../models/user.model.js";

// export const createKycService = async (userId) => {
//   const existing = await Kyc.findOne({ userId });
//   if (existing) throw new Error("KYC already submitted");

//   // yaha Sumsub applicant create hoga
//   const applicantId = "sumsub_applicant_id"; // placeholder

//   const kyc = await Kyc.create({
//     userId,
//     applicantId,
//     status: "PENDING",
//   });

//   await User.findByIdAndUpdate(userId, {
//     kycStatus: "PENDING",
//   });

//   return kyc;
// };
import axios from "axios";
import crypto from "crypto";

export const createKycService = async (userId) => {
  const existing = await Kyc.findOne({ userId });
  if (existing) throw new Error("KYC already submitted");

  const ts = Math.floor(Date.now() / 1000);

  const body = {
    externalUserId: userId.toString(),
  };

  const method = "POST";
  const url = `/resources/applicants?levelName=${process.env.SUMSUB_LEVEL_NAME}`;

  const signature = crypto
    .createHmac("sha256", process.env.SUMSUB_SECRET_KEY)
    .update(ts + method + url + JSON.stringify(body))
    .digest("hex");

  const response = await axios.post(
    `${process.env.SUMSUB_BASE_URL}${url}`,
    body,
    {
      headers: {
        "X-App-Token": process.env.SUMSUB_APP_TOKEN,
        "X-App-Access-Ts": ts,
        "X-App-Access-Sig": signature,
        "Content-Type": "application/json",
      },
    },
  );

  const applicantId = response.data.id;

  const kyc = await Kyc.create({
    userId,
    applicantId,
    status: "PENDING",
  });

  await User.findByIdAndUpdate(userId, {
    kycStatus: "PENDING",
  });

  return kyc;
};

export const getMyKycService = async (userId) => {
  const kyc = await Kyc.findOne({ userId });
  if (!kyc) throw new Error("KYC not found");
  return kyc;
};
export const getAllKycService = async () => {
  return await Kyc.find().populate("userId", "email role kycStatus");
};


export const handleWebhook = async (webhookData) => {
  const { applicantId, reviewResult, reviewStatus } = webhookData;

  // sirf completed reviews process karenge
  if (reviewStatus !== "completed") return null;

  // KYC record dhundho
  const kyc = await Kyc.findOne({ applicantId });
  if (!kyc) throw new Error("KYC record not found");

  // Update KYC + user status
  const status = reviewResult.toUpperCase() === "APPROVED" ? "APPROVED" : "REJECTED";

  kyc.status = status;
  await kyc.save();

  await User.findByIdAndUpdate(kyc.userId, { kycStatus: status });

  return kyc;
};
