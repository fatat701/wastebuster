import express from "express";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";
import nodemailer from "nodemailer";

const router = express.Router();

router.post("/checkout", async (req, res) => {
  try {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Unauthorized" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const { cart, paymentMethod } = req.body;

    // Récupérer l'utilisateur
    const [[user]] = await db.query("SELECT * FROM users WHERE id = ?", [decoded.id]);
    if (!user) return res.status(404).json({ error: "User not found" });

    // Calculer le total
    let total = 0;
    for (const item of cart) {
      const [[product]] = await db.query("SELECT * FROM products WHERE id = ?", [item.product_id]);
      if (!product) return res.status(400).json({ error: "Invalid product" });
      total += product.is_free ? 0 : product.price * (item.quantity || 1);
    }

    // Insérer la commande
    const [orderResult] = await db.query(
      "INSERT INTO orders (buyer_id, total_amount, payment_method, created_at) VALUES (?, ?, ?, NOW())",
      [decoded.id, total, paymentMethod]
    );

    const orderId = orderResult.insertId;

    // Insérer les items de commande avec prix calculé
    for (const item of cart) {
      const [[product]] = await db.query("SELECT * FROM products WHERE id = ?", [item.product_id]);
      const price = product.is_free ? 0 : product.price * (item.quantity || 1);
      await db.query(
        "INSERT INTO order_items (order_id, product_id, price, created_at) VALUES (?, ?, ?, NOW())",
        [orderId, item.product_id, price]
      );
    }

    // Générer la liste HTML des produits pour l'email
    const productListHTML = cart.map(item => {
      const quantity = item.quantity || 1;
      // On peut ici récupérer le nom du produit depuis le DB si besoin, 
      // mais pour simplifier, on met juste ID (tu peux adapter si tu passes plus d’infos côté frontend)
      return `<li>${quantity} x Produit ID ${item.product_id} - €${(item.price || 0).toFixed(2)}</li>`;
    }).join("");

    // Configurer le transporteur email
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    // Préparer l’email avec la liste des produits et total
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: "Your WasteBuster Reservation",
      html: `
        <h3>Hello ${user.first_name},</h3>
        <p>Your reservation is confirmed.</p>
        <ul>${productListHTML}</ul>
        <p><strong>Total:</strong> €${total.toFixed(2)}</p>
        <p><strong>Payment Method:</strong> ${paymentMethod}</p>
        <p>Thank you for using WasteBuster!</p>
      `,
    };

    await transporter.sendMail(mailOptions);

    res.status(201).json({ message: "Reservation confirmed" });
  } catch (err) {
    console.error("Checkout error:", err);
    res.status(500).json({ error: "Checkout failed", details: err.message });
  }
});

// ... autre route /my-orders

export default router;
