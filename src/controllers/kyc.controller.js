import {
  createKycService,
  getAllKycService,
  getMyKycService,
  handleWebhook,
} from "../services/kyc.service.js";
import { io } from "../index.js";


export const createKyc = async (req, res) => {
  try {
    const kyc = await createKycService(req.user._id);
    res.status(201).json({
      message:
        "Hey thank you for submitting your KYC. We will review it and get back to you shortly.",
      data: kyc,
    });
  } catch (error) {
    console.log("Error in submit kyc", error.message);
  }
};

export const getMykyc = async (req, res) => {
  try {
    const kyc = await getMyKycService(req.user._id);
    res.status(200).json({
      message: "KYC fetched successfully",
      data: kyc,
    });
  } catch (error) {
    console.log("Error in get my kyc", error.message);
  }
};
export const getAllKyc = async (req, res) => {
  try {
    const kycs = await getAllKycService();
    res.status(200).json({
      message: "All KYCs fetched successfully",
      total: kycs.length,
      data: kycs,
    });
  } catch (error) {
    console.log("Error in get all kycs", error.message);
  }
};
// export const webhookKycController = async (req, res) => {
//   try {
//     const updatedKyc = await handleWebhook(req.body);

//     if (!updatedKyc) {
//       return res
//         .status(200)
//         .json({ message: "Webhook received but review not completed" });
//     }

//     res.status(200).json({
//       message: "KYC status updated successfully",
//       data: updatedKyc,
//     });
//   } catch (error) {
//     console.log("Error in KYC webhook:", error.message);
//     res
//       .status(500)
//       .json({ message: "Internal server error", error: error.message });
//   }
// };

// Test for user protected actions means without verified they are not allowed to do any action

export const webhookKycController = async (req, res) => {
  try {
    const updatedKyc = await handleWebhook(req.body);

    if (!updatedKyc) {
      return res
        .status(200)
        .json({ message: "Webhook received but review not completed" });
    }

    // Emit live update to all connected clients
    io.emit("kycStatusUpdate", updatedKyc);

    res.status(200).json({
      message: "KYC status updated successfully",
      data: updatedKyc,
    });
  } catch (error) {
    console.log("Error in KYC webhook:", error.message);
    res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
};

export const testProtected = async (req, res) => {
  res.status(200).json({
    message: "You have access to this protected route",
    user: req.user,
  });
};
