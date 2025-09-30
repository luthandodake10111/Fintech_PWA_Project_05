const payFastService = require('../services/payFastService');
const transactionService = require('../services/transactionService');

class PaymentController {
  // ENDPOINT 1: Create payment (frontend calls this)
  async createPayment(req, res) {
    try {
      const { sellerId, amount, description } = req.body;
      const buyer = req.user;  // From auth middleware

      // Step 1: Save to database
      const transaction = await transactionService.createTransaction(
        buyer.id,
        sellerId,
        amount,
        description
      );

      // Step 2: Generate PayFast form data
      const paymentData = payFastService.generatePaymentData(
        transaction.id,
        amount,
        description,
        buyer
      );

      // Step 3: Send to frontend
      res.json({
        success: true,
        payment: paymentData  // Frontend uses this to redirect
      });

    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }

  // ENDPOINT 2: PayFast callback (PayFast calls this automatically)
  async handlePayFastITN(req, res) {
    try {
      const itnData = req.body;

      // Validate signature
      if (!payFastService.validateSignature(itnData)) {
        return res.status(400).send('Invalid signature');
      }

      // Update database
      const transactionId = itnData.custom_int1;
      await transactionService.updatePaymentStatus(transactionId, itnData);

      // Tell PayFast we received it
      res.status(200).send('OK');

    } catch (error) {
      res.status(500).send('Error');
    }
  }
}

module.exports = new PaymentController();