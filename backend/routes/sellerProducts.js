import express from "express";
import { db } from "../config/db.js";
import jwt from "jsonwebtoken";

const router = express.Router();

// GET all products for logged-in seller
router.get("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const [products] = await db.query("SELECT * FROM products WHERE seller_id = ?", [decoded.id]);

    res.json(products);
  } catch (err) {
    res.status(500).json({ error: "Failed to fetch seller products" });
  }
});

// POST: Add new product by seller
router.post("/", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const sellerId = decoded.id;

    let { name, category, images, price, is_free, location, expires_at } = req.body;

    // ✅ Nettoyage des champs
    if (!name || !category || !location) {
      return res.status(400).json({ error: "Missing required fields" });
    }

    // ✅ Gestion des images
    if (Array.isArray(images)) {
      images = JSON.stringify(images.map((i) => i.trim()));
    } else if (typeof images === "string") {
      const list = images.split(",").map((i) => i.trim());
      images = JSON.stringify(list);
    } else {
      images = JSON.stringify([]);
    }

    // ✅ Gestion du champ "gratuit"
    is_free = is_free === true || is_free === "true";
    price = is_free ? 0 : parseFloat(price);

    // ✅ Insertion du produit
    const [result] = await db.query(
      `INSERT INTO products (name, category, images, price, is_free, location, expires_at, seller_id, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [name, category, images, price, is_free, location, expires_at, sellerId]
    );

    const [newProductRows] = await db.query("SELECT * FROM products WHERE id = ?", [result.insertId]);
    res.status(201).json(newProductRows[0]);
  } catch (err) {
    console.error("POST /products/seller error:", err);
    res.status(500).json({ error: "Failed to add product" });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const productId = req.params.id;

    let { name, category, images, price, is_free, location, expires_at } = req.body;

    // Nettoyage images
    if (Array.isArray(images)) {
      images = JSON.stringify(images.map((i) => i.trim()));
    } else if (typeof images === "string") {
      try {
        const parsed = JSON.parse(images);
        if (Array.isArray(parsed)) {
          images = JSON.stringify(parsed.map((i) => i.trim()));
        } else {
          images = JSON.stringify([parsed]);
        }
      } catch {
        images = JSON.stringify(images.split(",").map((i) => i.trim()));
      }
    }

    is_free = is_free === true || is_free === "true";
    price = is_free ? 0 : parseFloat(price);

    const [existing] = await db.query(
      "SELECT * FROM products WHERE id = ? AND seller_id = ?",
      [productId, decoded.id]
    );
    if (existing.length === 0) {
      return res.status(404).json({ error: "Product not found or unauthorized" });
    }

    await db.query(
      "UPDATE products SET name=?, category=?, images=?, price=?, is_free=?, location=?, expires_at=? WHERE id=?",
      [name, category, images, price, is_free, location, expires_at, productId]
    );

    // 🔥 Le plus important : on renvoie les vraies données à jour
    const [updatedRows] = await db.query("SELECT * FROM products WHERE id = ?", [productId]);
    res.json(updatedRows[0]); // ✅ VOILÀ le vrai fix
  } catch (err) {
    console.error("PUT /products/:id error:", err);
    res.status(500).json({ error: "Failed to update product" });
  }
});


// DELETE: Delete product by seller
router.delete("/:id", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const productId = req.params.id;

    // Vérifier que le produit appartient au vendeur
    const [rows] = await db.query(
      "SELECT * FROM products WHERE id = ? AND seller_id = ?",
      [productId, decoded.id]
    );
    if (rows.length === 0) return res.status(404).json({ error: "Product not found" });

    // Supprimer le produit
    await db.query("DELETE FROM products WHERE id = ?", [productId]);

    res.json({ message: "Product deleted", productId });
  } catch (err) {
    console.error("DELETE /:id error:", err);
    res.status(500).json({ error: "Failed to delete product" });
  }
});


export default router;
