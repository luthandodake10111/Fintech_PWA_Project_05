import transactionService from "../services/transactionService.js";
import payFastService from "../services/payFastService.js";

/**
 * Payment Controller - Express route handlers
 */
const paymentController = {
  /**
   * POST /api/payments/create
   * Create transaction and initiate PayFast payment
   */
  async createPayment(req, res) {
    try {
      const { sellerId, amount, description } = req.body;
      const buyer = req.user; // From auth middleware

      // Validation
      if (!sellerId || !amount || !description) {
        return res.status(400).json({
          success: false,
          error: "Missing required fields: sellerId, amount, description",
        });
      }

      if (parseFloat(amount) <= 0) {
        return res.status(400).json({
          success: false,
          error: "Amount must be greater than 0",
        });
      }

      // Create transaction and get payment data
      const result = await transactionService.createTransaction(
        buyer.id,
        sellerId,
        amount,
        description
      );

      return res.status(201).json({
        success: true,
        transaction: result.transaction,
        payment: result.payment,
      });
    } catch (error) {
      console.error("Create payment error:", error);
      return res.status(500).json({
        success: false,
        error: error.message || "Failed to create payment",
      });
    }
  },

  /**
   * POST /api/payments/payfast-itn
   * Handle PayFast Instant Transaction Notification
   */
  async handlePayFastITN(req, res) {
    try {
      const itnData = req.body;

      console.log("PayFast ITN received:", JSON.stringify(itnData, null, 2));

      // Validate required fields
      const requiredFields = [
        "m_payment_id",
        "pf_payment_id",
        "payment_status",
        "amount_gross",
        "signature",
      ];
      for (const field of requiredFields) {
        if (!itnData[field]) {
          console.error(`Missing required field: ${field}`);
          return res.status(400).send("Invalid ITN - missing required fields");
        }
      }

      // Validate signature
      if (!payFastService.validateSignature(itnData)) {
        console.error("Invalid signature");
        return res.status(400).send("Invalid signature");
      }

      // Verify with PayFast servers
      const isValid = await payFastService.verifyPayment(itnData);
      if (!isValid) {
        console.error("Payment verification failed");
        return res.status(400).send("Payment verification failed");
      }

      // Update transaction status
      const transactionId = itnData.custom_int1;
      await transactionService.updatePaymentStatus(transactionId, itnData);

      // Send 200 OK to acknowledge receipt
      return res.status(200).send("OK");
    } catch (error) {
      console.error("ITN processing error:", error);
      return res.status(500).send("Internal server error");
    }
  },

  /**
   * POST /api/payments/transactions/:transactionId/release-funds
   * Release funds to seller
   */
  async releaseFunds(req, res) {
    try {
      const { transactionId } = req.params;
      const user = req.user; // From auth middleware

      if (!transactionId) {
        return res.status(400).json({
          success: false,
          error: "Transaction ID is required",
        });
      }

      const transaction = await transactionService.releaseFunds(
        transactionId,
        user.id
      );

      return res.json({
        success: true,
        message: "Funds released successfully",
        transaction,
      });
    } catch (error) {
      console.error("Release funds error:", error);
      return res.status(400).json({
        success: false,
        error: error.message || "Failed to release funds",
      });
    }
  },

  /**
   * GET /api/payments/transactions/:transactionId
   * Get transaction details
   */
  async getTransaction(req, res) {
    try {
      const { transactionId } = req.params;
      const user = req.user;

      const transaction = await transactionService.getTransaction(
        transactionId,
        user.id
      );

      return res.json({
        success: true,
        transaction,
      });
    } catch (error) {
      console.error("Get transaction error:", error);
      return res.status(400).json({
        success: false,
        error: error.message || "Failed to get transaction",
      });
    }
  },
};

export default paymentController;
