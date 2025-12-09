import { Router } from "express";
import Invoice from "../models/invoice.model.js";
import Order from "../models/order.model.js";

const router = Router();


router.post("/", async (req, res) => {
  try {
    const { orderId, paymentMethod, markAsPaid } = req.body;

    if (!orderId) {
      return res.status(400).json({ message: "orderId est obligatoire" });
    }

    const order = await Order.findById(orderId).populate("user");

    if (!order) {
      return res.status(404).json({ message: "Commande non trouvée" });
    }


    const existingInvoice = await Invoice.findOne({ order: order._id });
    if (existingInvoice) {
      return res
        .status(409)
        .json({ message: "Une facture existe déjà pour cette commande" });
    }

    const invoice = await Invoice.create({
      order: order._id,
      user: order.user._id,
      totalAmount: order.totalAmount,
      status: markAsPaid ? "paid" : "unpaid",
      issuedAt: new Date(),
      paidAt: markAsPaid ? new Date() : undefined,
      paymentMethod: paymentMethod || "card",
    });

    res.status(201).json(invoice);
  } catch (error) {
    console.error("Erreur création facture:", error.message);
    res.status(500).json({
      message: "Erreur serveur lors de la création de la facture",
      error: error.message,
    });
  }
});


router.get("/", async (req, res) => {
  try {
    const { userId, status, startDate, endDate } = req.query;
    const query = {};

    if (userId) query.user = userId;
    if (status) query.status = status;

    if (startDate || endDate) {
      query.issuedAt = {};
      if (startDate) query.issuedAt.$gte = new Date(startDate);
      if (endDate) query.issuedAt.$lte = new Date(endDate);
    }

    const invoices = await Invoice.find(query)
      .populate("user", "firstname lastname email")
      .populate("order", "totalAmount status createdAt");

    res.json(invoices);
  } catch (error) {
    console.error("Erreur récupération factures:", error.message);
    res.status(500).json({
      message: "Erreur serveur lors de la récupération des factures",
      error: error.message,
    });
  }
});


router.get("/stats/revenue", async (_req, res) => {
  try {
    const stats = await Invoice.aggregate([
      { $match: { status: "paid" } },
      {
        $group: {
          _id: {
            year: { $year: "$issuedAt" },
            month: { $month: "$issuedAt" },
          },
          totalRevenue: { $sum: "$totalAmount" },
          invoicesCount: { $sum: 1 },
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
    console.error("Erreur stats revenue:", error.message);
    res.status(500).json({
      message: "Erreur serveur lors des stats de revenue",
      error: error.message,
    });
  }
});

export default router;
