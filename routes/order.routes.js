// routes/order.routes.js
import { Router } from "express";
import Order from "../models/order.model.js";

const router = Router();

// juste pour vérifier que le fichier est bien chargé
console.log("✅ order.routes.js chargé (version FINALE)");

/**
 * POST /api/orders
 * Créer une commande
 */
router.post("/", async (req, res) => {
  try {
    const { userId, items, status } = req.body;

    if (!userId || !items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        message: "userId et items (tableau) sont obligatoires",
      });
    }

    // Calcul du total
    const totalAmount = items.reduce((sum, item) => {
      const q = item.quantity || 0;
      const p = item.priceAtOrder || 0;
      return sum + q * p;
    }, 0);

    const order = await Order.create({
      user: userId,
      items: items.map((i) => ({
        product: i.productId,
        quantity: i.quantity,
        priceAtOrder: i.priceAtOrder,
      })),
      status: status || "pending",
      totalAmount,
    });

    res.status(201).json(order);
  } catch (error) {
    console.error("Erreur création commande:", error.message);
    res.status(500).json({
      message: "Erreur serveur lors de la création",
      error: error.message,
    });
  }
});

/**
 * GET /api/orders
 * Liste des commandes (simple pour l’instant)
 */
router.get("/", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    console.error("Erreur récupération commandes:", error.message);
    res.status(500).json({
      message: "Erreur serveur lors de la récupération",
      error: error.message,
    });
  }
});

/**
 * GET /api/orders/stats/monthly
 * Statistiques mensuelles (CA + nombre de commandes)
 */
router.get("/stats/monthly", async (req, res) => {
  try {
    const stats = await Order.aggregate([
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
          },
          totalAmount: { $sum: "$totalAmount" },
          ordersCount: { $sum: 1 },
        },
      },
      {
        $sort: {
          "_id.year": 1,
          "_id.month": 1,
        },
      },
    ]);

    res.json(stats);
  } catch (error) {
    console.error("Erreur stats commandes:", error.message);
    res.status(500).json({
      message: "Erreur serveur lors des stats",
      error: error.message,
    });
  }
});

export default router;
