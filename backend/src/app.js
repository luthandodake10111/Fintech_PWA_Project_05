import express from "express";
import cors from "cors";
import router from "./routes/router.js"; // your main routes
import paymentRoutes from "./routes/payments.js"; // payments routes
import { PrismaClient } from "@prisma/client"; // Prisma client

const app = express();
const prisma = new PrismaClient();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true })); // ✅ for PayFast ITN

// Routes
app.use("/api", router);
app.use("/api/payments", paymentRoutes);

// Test route
app.get("/", (req, res) => {
  res.send("Server is running!");
});

// Start server with DB connection
const startServer = async () => {
  try {
    await prisma.$connect();
    console.log("Connected to PostgreSQL via Prisma!");

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Failed to connect to database:", error);
    process.exit(1);
  }
};

startServer();
