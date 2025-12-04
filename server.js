// server.js
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";

dotenv.config();

const app = express();

app.use(express.json());

// Route de test
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend Node.js + MongoDB opérationnel 🚀",
  });
});

// Routes Users
app.use("/api/users", userRoutes);

// Routes Orders
app.use("/api/orders", orderRoutes);

const PORT = process.env.PORT || 4000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("❌ Erreur de démarrage du serveur :", error.message);
    process.exit(1);
  }
};

startServer();
