import { PrismaClient } from "@prisma/client";


const prisma = new PrismaClient();

// ====================
// USERS
// ====================

// Get all users
export const getUsers = async (req, res) => {
  const users = await prisma.user.findMany({
    include: { transactions: true, disputes: true },
  });
  res.json({ users });
};

// Get user by ID
export const getUserById = async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id: Number(id) },
    include: { transactions: true, disputes: true },
  });
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json({ user });
};

// Create new user
export const createUser = async (req, res) => {
  const { name, email } = req.body;
  const user = await prisma.user.create({
    data: { name, email },
  });
  res.status(201).json({ user });
};

// Update user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email } = req.body;
  const user = await prisma.user.update({
    where: { id: Number(id) },
    data: { name, email },
  });
  res.json({ user });
};

// Delete user
export const deleteUser = async (req, res) => {
  const { id } = req.params;
  const deleted = await prisma.user.delete({
    where: { id: Number(id) },
  });
  res.json({ deleted });
};

// ====================
// TRANSACTIONS
// ====================

// Get all transactions
export const getTransactions = async (req, res) => {
  const transactions = await prisma.transaction.findMany({
    include: { user: true, disputes: true },
  });
  res.json({ transactions });
};

// Get transaction by ID
export const getTransactionById = async (req, res) => {
  const { id } = req.params;
  const transaction = await prisma.transaction.findUnique({
    where: { id: Number(id) },
    include: { user: true, disputes: true },
  });
  if (!transaction) return res.status(404).json({ error: "Transaction not found" });
  res.json({ transaction });
};

// Create new transaction
export const createTransaction = async (req, res) => {
  const { amount, description, userId } = req.body;
  const transaction = await prisma.transaction.create({
    data: { amount, description, userId: Number(userId) },
  });
  res.status(201).json({ transaction });
};

// Update transaction
export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  const { amount, description } = req.body;
  const transaction = await prisma.transaction.update({
    where: { id: Number(id) },
    data: { amount, description },
  });
  res.json({ transaction });
};

// Delete transaction
export const deleteTransaction = async (req, res) => {
  const { id } = req.params;
  const deleted = await prisma.transaction.delete({
    where: { id: Number(id) },
  });
  res.json({ deleted });
};

// ====================
// DISPUTES
// ====================

// Get all disputes
export const getDisputes = async (req, res) => {
  const disputes = await prisma.dispute.findMany({
    include: { user: true, transaction: true },
  });
  res.json({ disputes });
};

// Get dispute by ID
export const getDisputeById = async (req, res) => {
  const { id } = req.params;
  const dispute = await prisma.dispute.findUnique({
    where: { id: Number(id) },
    include: { user: true, transaction: true },
  });
  if (!dispute) return res.status(404).json({ error: "Dispute not found" });
  res.json({ dispute });
};

// Create dispute
export const createDispute = async (req, res) => {
  const { reason, status, userId, transactionId } = req.body;
  const dispute = await prisma.dispute.create({
    data: {
      reason,
      status,
      userId: Number(userId),
      transactionId: Number(transactionId),
    },
  });
  res.status(201).json({ dispute });
};

// Update dispute
export const updateDispute = async (req, res) => {
  const { id } = req.params;
  const { reason, status } = req.body;
  const dispute = await prisma.dispute.update({
    where: { id: Number(id) },
    data: { reason, status },
  });
  res.json({ dispute });
};

// Delete dispute
export const deleteDispute = async (req, res) => {
  const { id } = req.params;
  const deleted = await prisma.dispute.delete({
    where: { id: Number(id) },
  });
  res.json({ deleted });
};
