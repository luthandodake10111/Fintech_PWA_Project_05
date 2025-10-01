import crypto from "crypto";
import axios from "axios";
import config from "../config/payfast.js";

/**
 * PayFast Service - Handles PayFast API integration
 */
const payFastService = {
  /**
   * Generate payment data for PayFast
   */
  generatePaymentData(transaction, buyer) {
    const data = {
      merchant_id: config.payfast.merchantId,
      merchant_key: config.payfast.merchantKey,
      return_url: `${process.env.FRONTEND_URL}/payment/success?transaction=${transaction.id}`,
      cancel_url: `${process.env.FRONTEND_URL}/payment/cancel?transaction=${transaction.id}`,
      notify_url: `${process.env.BACKEND_URL}/api/payments/payfast-itn`,
      amount: parseFloat(transaction.amount).toFixed(2),
      item_name: `Transaction #${transaction.id}`,
      item_description: transaction.description || "Escrow Transaction",
      email_address: buyer.email,
      name_first: buyer.firstName || "",
      name_last: buyer.lastName || "",
      cell_number: buyer.cellNumber || "",
      custom_int1: transaction.id, // Store transaction ID
    };

    // Generate signature
    data.signature = this.createSignature(data);

    return {
      url: config.payfast.baseUrl,
      data,
    };
  },

  /**
   * Create MD5 signature for PayFast
   */
  createSignature(data) {
    // Remove signature if exists
    const signatureData = { ...data };
    delete signatureData.signature;

    // Sort keys and create query string
    const sortedKeys = Object.keys(signatureData).sort();
    const paramString = sortedKeys
      .map(
        (key) =>
          `${key}=${encodeURIComponent(
            signatureData[key]?.toString().trim()
          )}`
      )
      .join("&");

    // Add passphrase if configured
    const stringToHash = config.payfast.passphrase
      ? `${paramString}&passphrase=${encodeURIComponent(
          config.payfast.passphrase
        )}`
      : paramString;

    return crypto.createHash("md5").update(stringToHash).digest("hex");
  },

  /**
   * Validate ITN signature
   */
  validateSignature(data) {
    const receivedSignature = data.signature;
    const calculatedSignature = this.createSignature(data);
    return receivedSignature === calculatedSignature;
  },

  /**
   * Verify payment with PayFast servers
   */
  async verifyPayment(data) {
    try {
      const response = await axios.post(
        config.payfast.validateUrl,
        new URLSearchParams(data).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
          timeout: 10000,
        }
      );

      return response.data === "VALID";
    } catch (error) {
      console.error("PayFast verification error:", error.message);
      return false;
    }
  },
};

export default payFastService;
