// routes/review.routes.js
import { Router } from "express";
import Review from "../models/review.model.js";

const router = Router();

/**
 * POST /api/reviews
 * Créer ou mettre à jour un avis pour un produit
 * Body: { userId, productId, rating, comment }
 */
router.post("/", async (req, res) => {
  try {
    const { userId, productId, rating, comment } = req.body;

    if (!userId || !productId || rating == null) {
      return res.status(400).json({
        message: "userId, productId et rating sont obligatoires",
      });
    }

    if (rating < 1 || rating > 5) {
      return res
        .status(400)
        .json({ message: "rating doit être entre 1 et 5" });
    }

    // upsert: si l'user a déjà noté ce produit, on met à jour
    const review = await Review.findOneAndUpdate(
      { user: userId, product: productId },
      { rating, comment },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    );

    res.status(201).json(review);
  } catch (error) {
    console.error("Erreur création avis:", error.message);
    res.status(500).json({
      message: "Erreur serveur lors de la création de l'avis",
      error: error.message,
    });
  }
});

/**
 * GET /api/reviews
 * Liste des avis avec filtres
 * ?userId=&productId=&minRating=&maxRating=
 */
router.get("/", async (req, res) => {
  try {
    const { userId, productId, minRating, maxRating } = req.query;
    const query = {};

    if (userId) query.user = userId;
    if (productId) query.product = productId;

    if (minRating || maxRating) {
      query.rating = {};
      if (minRating) query.rating.$gte = Number(minRating);
      if (maxRating) query.rating.$lte = Number(maxRating);
    }

    const reviews = await Review.find(query)
      .populate("user", "firstname lastname email")
      .populate("product", "name price category");

    res.json(reviews);
  } catch (error) {
    console.error("Erreur récupération avis:", error.message);
    res.status(500).json({
      message: "Erreur serveur lors de la récupération des avis",
      error: error.message,
    });
  }
});

/**
 * GET /api/reviews/stats/product
 * Statistiques par produit:
 * moyenne, nb d'avis, min, max
 * ?productId= (optionnel, sinon pour tous)
 */
router.get("/stats/product", async (req, res) => {
  try {
    const { productId } = req.query;
    const match = {};

    if (productId) {
      match.product = Review.castObjectId
        ? Review.castObjectId(productId)
        : productId;
      // mais plus simple: on laisse tel quel
      match.product = productId;
    }

    const pipeline = [];

    if (productId) {
      pipeline.push({ $match: { product: Review.schema.path("product").cast(productId) } });
    }

    pipeline.push(
      {
        $group: {
          _id: "$product",
          avgRating: { $avg: "$rating" },
          minRating: { $min: "$rating" },
          maxRating: { $max: "$rating" },
          reviewsCount: { $sum: 1 },
        },
      },
      {
        $sort: { avgRating: -1 },
      }
    );

    const stats = await Review.aggregate(pipeline);

    res.json(stats);
  } catch (error) {
    console.error("Erreur stats avis:", error.message);
    res.status(500).json({
      message: "Erreur serveur lors des stats avis",
      error: error.message,
    });
  }
});

export default router;
