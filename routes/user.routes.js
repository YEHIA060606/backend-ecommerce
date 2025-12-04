// routes/user.routes.js
import { Router } from "express";
import fs from "fs";
import User from "../models/user.model.js";

const router = Router();

/**
 * POST /api/users
 * Créer un utilisateur
 */
router.post("/", async (req, res) => {
  try {
    const { firstname, lastname, email, password, role } = req.body;

    // Vérifier les champs obligatoires
    if (!firstname || !lastname || !email || !password) {
      return res.status(400).json({
        message: "firstname, lastname, email et password sont obligatoires",
      });
    }

    // Vérifier si l'email existe déjà
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(409).json({ message: "Email déjà utilisé" });
    }

    // Créer l'utilisateur
    const user = await User.create({
      firstname,
      lastname,
      email,
      password,
      role,
    });

    // On renvoie l'utilisateur créé
    res.status(201).json(user);
  } catch (error) {
    console.error("Erreur création user:", error.message);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la création", error: error.message });
  }
});

/**
 * GET /api/users
 * Récupérer la liste des users avec recherche + filtres + pagination
 */
router.get("/", async (req, res) => {
  try {
    const { search, role, page = 1, limit = 10 } = req.query;

    const query = {};

    if (role) {
      query.role = role;
    }

    if (search) {
      query.$or = [
        { firstname: { $regex: search, $options: "i" } },
        { lastname: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    const pageNumber = Number(page) || 1;
    const limitNumber = Number(limit) || 10;
    const skip = (pageNumber - 1) * limitNumber;

    const [users, total] = await Promise.all([
      User.find(query).skip(skip).limit(limitNumber),
      User.countDocuments(query),
    ]);

    res.json({
      page: pageNumber,
      limit: limitNumber,
      total,
      data: users,
    });
  } catch (error) {
    console.error("Erreur récupération users:", error.message);
    res
      .status(500)
      .json({ message: "Erreur serveur lors de la récupération", error: error.message });
  }
});

/**
 * POST /api/users/import
 * Importer des users depuis /data/users.json
 */
router.post("/import", async (req, res) => {
  try {
    // lire le fichier JSON (chemin relatif à la racine du projet)
    const data = fs.readFileSync("./data/users.json", "utf-8");
    const users = JSON.parse(data);

    // insérer dans la base
    // option: ordered: false pour ignorer ceux qui ont des emails déjà utilisés
    const inserted = await User.insertMany(users, { ordered: false });

    res.status(201).json({
      message: "Importation réussie",
      total: inserted.length,
      data: inserted,
    });
  } catch (error) {
    console.error("Erreur import users:", error.message);
    res.status(500).json({
      message: "Erreur serveur lors de l'import",
      error: error.message,
    });
  }
});

/**
 * GET /api/users/stats/orders
 * (à utiliser quand la collection Orders sera prête)
 * Statistiques : nb de commandes + total dépensé par user
 */
router.get("/stats/orders", async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $lookup: {
          from: "orders",        // nom de la collection MongoDB
          localField: "_id",     // _id du user
          foreignField: "user",  // champ "user" dans la collection orders
          as: "orders",
        },
      },
      {
        $project: {
          firstname: 1,
          lastname: 1,
          email: 1,
          role: 1,
          ordersCount: { $size: "$orders" },
          totalSpent: { $sum: "$orders.totalAmount" },
        },
      },
      { $sort: { totalSpent: -1 } },
    ]);

    res.json(stats);
  } catch (error) {
    console.error("Erreur stats users:", error.message);
    res
      .status(500)
      .json({ message: "Erreur serveur lors des statistiques", error: error.message });
  }
});

export default router;
