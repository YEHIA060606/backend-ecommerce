// server.js
import express from "express";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import orderRoutes from "./routes/order.routes.js";
import productRoutes from "./routes/product.routes.js";
import invoiceRoutes from "./routes/invoice.routes.js";
import reviewRoutes from "./routes/review.routes.js";



dotenv.config();

const app = express();

app.use(express.json());


app.get("/api/health", (req, res) => {
  res.status(200).json({
    status: "OK",
    message: "Backend Node.js + MongoDB opérationnel 🚀",
  });
});


app.use("/api/users", userRoutes);


app.use("/api/orders", orderRoutes);


app.use("/api/products", productRoutes);


app.use("/api/invoices", invoiceRoutes);


app.use("/api/reviews", reviewRoutes);



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
