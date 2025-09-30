const crypto = require('crypto');
const config = require('../config/payfast');

class PayFastService {
  generatePaymentData(transactionId, amount, description, buyer) {
    const data = {
      merchant_id: config.merchantId,
      merchant_key: config.merchantKey,
      return_url: `http://localhost:5173/payment/success`,
      cancel_url: `http://localhost:5173/payment/cancel`,
      notify_url: `http://localhost:3000/api/payments/payfast-itn`,
      amount: parseFloat(amount).toFixed(2),
      item_name: `Transaction #${transactionId}`,
      item_description: description,
      email_address: buyer.email,
      name_first: buyer.firstName,
      name_last: buyer.lastName,
      custom_int1: transactionId  
    };

    // Create signature
    const signature = this.createSignature(data);
    data.signature = signature;

    return {
      url: config.baseUrl,
      data: data
    };
  }

  createSignature(data) {
    const params = new URLSearchParams(data);
    const paramString = params.toString();
    return crypto.createHash('md5').update(paramString).digest('hex');
  }

  validateSignature(data) {
    const receivedSignature = data.signature;
    delete data.signature;
    const calculatedSignature = this.createSignature(data);
    return receivedSignature === calculatedSignature;
  }
}

module.exports = new PayFastService();