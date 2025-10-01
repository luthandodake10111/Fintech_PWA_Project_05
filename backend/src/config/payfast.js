import express from "express";
import paymentController from "../controller/paymentController.js";

const router = express.Router();

/**
 * Payment Routes
 */

// Create payment
router.post("/create", paymentController.createPayment);

// PayFast ITN callback (public - PayFast calls this)
router.post("/payfast-itn", paymentController.handlePayFastITN);

// Release funds
router.post(
  "/transactions/:transactionId/release-funds",
  paymentController.releaseFunds
);

// Get transaction details
router.get(
  "/transactions/:transactionId",
  paymentController.getTransaction
);

export default router;
