# 📦 Backend E-Commerce – Node.js + Express + MongoDB

Backend complet d’une plateforme E-Commerce réalisé dans le cadre d’un projet académique.  
Il inclut la gestion des utilisateurs, produits, commandes, factures et avis, avec statistiques et filtres avancés.

---

## 👥 Membres du groupe

| Étudiant | Module réalisé | Description |
|----------|----------------|-------------|
| **Yahya** | 👤 Users | CRUD Users + import JSON + recherche + pagination |
| **Hocine** | 🛒 Orders | Création commande + filtres + stats mensuelles |
| **Malik** | 📦 Products | CRUD produits + filtres + stats prix |
| **Walid** | 💸 Invoices | Factures liées aux commandes + stats de revenue |
| **Boubaker** | ⭐ Reviews | Avis produits + stats de notes (à venir) |

---

## 🛠️ Technologies utilisées

- **Node.js**
- **Express.js**
- **MongoDB + Mongoose**
- **Thunder Client / Postman** pour tests API

---

## 📁 Structure du projet

```txt
backend-ecommerce/
│
├── config/
│   └── db.js        # Connexion MongoDB
│
├── models/
│   ├── user.model.js
│   ├── product.model.js
│   ├── order.model.js
│   ├── invoice.model.js
│   └── review.model.js
│
├── routes/
│   ├── user.routes.js
│   ├── product.routes.js
│   ├── order.routes.js
│   ├── invoice.routes.js
│   └── review.routes.js
│
├── data/
│   └── users.json   # Import Users
│
├── server.js
├── .env
└── package.json
```
---

# 🚀 Démarrage du projet

### 1️⃣ Installer les dépendances

```bash
npm install 
2️⃣ Configurer les variables d’environnement
Créer un fichier .env :

ini
MONGO_URI=mongodb://127.0.0.1/backend_ecommerce
PORT=4000
3️⃣ Lancer le serveur
En terminal cmd :
npm run dev
Le serveur démarre sur :

Le serveur démarre sur :
http://localhost:4000


📡 Endpoints Principaux
👤 Users (Yahia)
Méthode	Route	Description
POST	/api/users	Créer un utilisateur
GET	/api/users	Liste + recherche + pagination
POST	/api/users/import	Import depuis users.json
GET	/api/users/stats/orders	Stats commandes par utilisateur

📦 Products (Malik)
Méthode	Route	Description
POST	/api/products	Ajouter un produit
GET	/api/products	Filtres : search, prix, catégorie, pagination
GET	/api/products/stats/basic	Stats prix (min, max, moyenne)

🛒 Orders (Hocine)
Méthode	Route	Description
POST	/api/orders	Créer une commande
GET	/api/orders	Lister commandes + filtres
GET	/api/orders/stats/monthly	Stats mensuelles (CA + nb commandes)

💸 Invoices (Walid)
Méthode	Route	Description
POST	/api/invoices	Générer une facture depuis une commande
GET	/api/invoices	Lister factures + filtres
GET	/api/invoices/stats/revenue	Stats CA généré

⭐ Reviews (Boubaker) 
Méthode	Route	Description
POST	/api/reviews	Ajouter un avis
GET	/api/reviews	Lister les avis
GET	/api/reviews/stats/product	Statistiques des notes

📌 Notes pour l’enseignant
Chaque étudiant a développé au moins 3 routes, avec filtrage ou agrégation.

Le backend est structuré selon une architecture MVC simplifiée.

Les modèles sont normalisés dans MongoDB et liés via Mongoose.

Les statistiques utilisent les pipelines d’agrégation MongoDB.

Thunder Client a été utilisé pour la validation des endpoints.

🎉 Conclusion
Ce backend constitue une base complète pour une application e-commerce moderne.
Il illustre la collaboration en groupe, la modularité et la gestion avancée de données avec MongoDB.

