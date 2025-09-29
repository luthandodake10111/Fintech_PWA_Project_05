import express from "express";
import {
  getUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getDisputes,
  getDisputeById,
  createDispute,
  updateDispute,
  deleteDispute,
} from "../controller/controller.js";

const router = express.Router();

// USERS
router.get("/users", getUsers);
router.get("/users/:id", getUserById);
router.post("/users", createUser);
router.put("/users/:id", updateUser);
router.delete("/users/:id", deleteUser);

// TRANSACTIONS
router.get("/transactions", getTransactions);
router.get("/transactions/:id", getTransactionById);
router.post("/transactions", createTransaction);
router.put("/transactions/:id", updateTransaction);
router.delete("/transactions/:id", deleteTransaction);

// DISPUTES
router.get("/disputes", getDisputes);
router.get("/disputes/:id", getDisputeById);
router.post("/disputes", createDispute);
router.put("/disputes/:id", updateDispute);
router.delete("/disputes/:id", deleteDispute);

export default router;
