import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.routes.js"; // <--- AJOUT

// Charger les variables d'environnement (.env)
dotenv.config();

// Créer l'application Express
const app = express();

// Middleware pour comprendre le JSON
app.use(express.json());

// Route de test
app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend Node.js + MongoDB opérationnel 🚀",
  });
});

// Routes Users
app.use("/api/users", userRoutes); // <--- AJOUT

// Port
const PORT = process.env.PORT || 4000;

// Lancer l'application
const startServer = async () => {
  await connectDB();

  app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
  });
};

startServer();
