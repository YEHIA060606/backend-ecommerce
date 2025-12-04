// routes/product.routes.js
import { Router } from "express";
import Product from "../models/product.model.js";

const router = Router();

/**
 * POST /api/products
 * Créer un produit
 */
router.post("/", async (req, res) => {
  try {
    const { name, description, price, stock, category } = req.body;

    if (!name || price == null) {
      return res.status(400).json({
        message: "name et price sont obligatoires",
      });
    }

    const product = await Product.create({
      name,
      description,
      price,
      stock,
      category,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la création du produit",
      error: error.message,
    });
  }
});

/**
 * GET /api/products
 * Filtres + pagination
 */
router.get("/", async (req, res) => {
  try {
    const {
      search,
      category,
      minPrice,
      maxPrice,
      page = 1,
      limit = 10,
    } = req.query;

    const query = {};

    if (category) query.category = category;

    if (search) query.name = { $regex: search, $options: "i" };

    if (minPrice || maxPrice) {
      query.price = {};
      if (minPrice) query.price.$gte = Number(minPrice);
      if (maxPrice) query.price.$lte = Number(maxPrice);
    }

    const pageNumber = Number(page);
    const limitNumber = Number(limit);
    const skip = (pageNumber - 1) * limitNumber;

    const [products, total] = await Promise.all([
      Product.find(query).skip(skip).limit(limitNumber),
      Product.countDocuments(query),
    ]);

    res.json({
      page: pageNumber,
      limit: limitNumber,
      total,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors de la récupération des produits",
      error: error.message,
    });
  }
});

/**
 * GET /api/products/stats/basic
 * Prix moyen, min, max, nombre total
 */
router.get("/stats/basic", async (_req, res) => {
  try {
    const stats = await Product.aggregate([
      {
        $group: {
          _id: null,
          avgPrice: { $avg: "$price" },
          minPrice: { $min: "$price" },
          maxPrice: { $max: "$price" },
          count: { $sum: 1 },
        },
      },
    ]);

    res.json(stats[0] || {});
  } catch (error) {
    res.status(500).json({
      message: "Erreur lors des stats produits",
      error: error.message,
    });
  }
});

export default router;
