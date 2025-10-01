import express from "express";
import paymentController from "../controller/paymentController.js";

const router = express.Router();

router.post("/create", paymentController.createPayment);
router.post("/payfast-itn", paymentController.handlePayFastITN);
router.post("/transactions/:transactionId/release-funds", paymentController.releaseFunds);
router.get("/transactions/:transactionId", paymentController.getTransaction);

export default router;
