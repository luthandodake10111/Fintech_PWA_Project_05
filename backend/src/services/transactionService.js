import { PrismaClient } from "@prisma/client";
import payFastService from "./payFastService.js";

const prisma = new PrismaClient();

/**
 * Transaction Service - Uses existing Prisma schema
 */
const transactionService = {
  /**
   * Create transaction and generate PayFast payment
   */
  async createTransaction(buyerId, sellerId, amount, description) {
    try {
      // Create transaction using Prisma
      const transaction = await prisma.transaction.create({
        data: {
          buyerId: buyerId,
          sellerId: sellerId,
          amount: parseFloat(amount),
          description: description,
          status: "AWAITING_PAYMENT",
        },
        include: {
          buyer: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
              cellNumber: true,
            },
          },
          seller: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      // Generate PayFast payment data
      const paymentData = payFastService.generatePaymentData(
        transaction,
        transaction.buyer
      );

      return {
        transaction,
        payment: paymentData,
      };
    } catch (error) {
      console.error("Transaction creation error:", error);
      throw new Error(`Failed to create transaction: ${error.message}`);
    }
  },

  /**
   * Update transaction status from PayFast ITN
   */
  async updatePaymentStatus(transactionId, itnData) {
    try {
      const paymentStatus = itnData.payment_status;

      let status;
      switch (paymentStatus) {
        case "COMPLETE":
          status = "FUNDED";
          break;
        case "FAILED":
          status = "FAILED";
          break;
        case "CANCELLED":
          status = "CANCELLED";
          break;
        default:
          status = "PENDING";
      }

      const updatedTransaction = await prisma.transaction.update({
        where: { id: transactionId },
        data: {
          status: status,
          payfastPaymentId: itnData.pf_payment_id,
          amountPaid: parseFloat(itnData.amount_gross),
          updatedAt: new Date(),
        },
      });

      console.log(`Transaction ${transactionId} updated to ${status}`);
      return updatedTransaction;
    } catch (error) {
      console.error("Payment status update error:", error);
      throw new Error(`Failed to update payment status: ${error.message}`);
    }
  },

  /**
   * Release funds to seller
   */
  async releaseFunds(transactionId, userId) {
    try {
      // Get transaction with relations
      const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId },
        include: {
          buyer: true,
          seller: true,
        },
      });

      // Validation
      if (!transaction) {
        throw new Error("Transaction not found");
      }

      if (transaction.buyerId !== userId) {
        throw new Error("Only the buyer can release funds");
      }

      if (transaction.status !== "FUNDED") {
        throw new Error("Transaction must be funded before releasing funds");
      }

      if (transaction.fundsReleased) {
        throw new Error("Funds have already been released");
      }

      // Update transaction
      const updatedTransaction = await prisma.transaction.update({
        where: { id: transactionId },
        data: {
          status: "COMPLETED",
          fundsReleased: true,
          fundsReleasedAt: new Date(),
        },
      });

      console.log(`Funds released for transaction ${transactionId}`);
      return updatedTransaction;
    } catch (error) {
      console.error("Fund release error:", error);
      throw error;
    }
  },

  /**
   * Get transaction by ID
   */
  async getTransaction(transactionId, userId) {
    try {
      const transaction = await prisma.transaction.findFirst({
        where: {
          id: transactionId,
          OR: [{ buyerId: userId }, { sellerId: userId }],
        },
        include: {
          buyer: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
          seller: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
      });

      if (!transaction) {
        throw new Error("Transaction not found or access denied");
      }

      return transaction;
    } catch (error) {
      throw error;
    }
  },
};

export default transactionService;
