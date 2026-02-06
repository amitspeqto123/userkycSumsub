import express from "express";
import { createKyc, getAllKyc, getMykyc, testProtected, webhookKycController } from "../controllers/kyc.controller.js";
import { checkKycApproved, isAdmin, isAuthenticated } from "../middlewares/jwt.js";


const router = express.Router();

router.post("/submit", isAuthenticated, createKyc);
router.get("/me", isAuthenticated, getMykyc);
router.get("/all", isAuthenticated, isAdmin, getAllKyc);
router.post("/webhook", webhookKycController);
router.get("/test-protected", isAuthenticated, checkKycApproved, testProtected);

export default router;
