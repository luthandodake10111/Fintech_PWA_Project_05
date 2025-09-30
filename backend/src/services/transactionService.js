const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

class TransactionService {
  async createTransaction(buyerId, sellerId, amount, description) {
    return await prisma.transaction.create({
      data: {
        buyerId,
        sellerId,
        amount: parseFloat(amount),
        description,
        status: 'AWAITING_PAYMENT'
      },
      include: {
        buyer: true,
        seller: true
      }
    });
  }

  async updatePaymentStatus(transactionId, payfastData) {
    const status = payfastData.payment_status === 'COMPLETE' ? 'FUNDED' : 'FAILED';
    
    return await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        status,
        payfastPaymentId: payfastData.pf_payment_id,
        amountPaid: parseFloat(payfastData.amount_gross)
      }
    });
  }
}

module.exports = new TransactionService();