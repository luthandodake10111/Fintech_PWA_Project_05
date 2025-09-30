import express from "express";
import cors from "cors";
import router from "./routes/router.js"; // your router file
import { PrismaClient } from "./generated/prisma/index.js"; // path to Prisma client

const app = express();
const prisma = new PrismaClient();
const paymentRoutes = require('./routes/payments');
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api", router);
app.use('/api/payments', paymentRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start server
app.listen(PORT, async () => {
  console.log(`Server running on http://localhost:${PORT}`);
  try {
    // Test Prisma connection
    await prisma.$connect();
    console.log("Connected to PostgreSQL via Prisma!");
  } catch (error) {
    console.error("Failed to connect to database:", error);
  }
});
