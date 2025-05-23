import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { db } from "../config/db.js";

const router = express.Router();

// 1. Signup Route
router.post("/signup", async (req, res) => {
  const { first_name, last_name, email, password, role } = req.body;

  if (!first_name || !last_name || !email || !password) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  try {
    // Check if email already exists
    const [existingUsers] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    if (existingUsers.length > 0) {
      return res.status(409).json({ error: "Email already registered" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await db.query(
      `INSERT INTO users (first_name, last_name, email, password_hash, avatar_url, verified, description, role, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [
        first_name,
        last_name,
        email,
        hashedPassword,
        "/placeholder.svg",
        0,
        "WasteBuster user profile",
        role || "client",
      ]
    );
    res.status(201).json({ message: "Account created successfully" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: "Signup failed", details: err.message || err });
  }
});

// 2. Login Route
router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: "Email and password required" });
  }

  try {
    const [rows] = await db.query("SELECT * FROM users WHERE email = ?", [email]);
    if (rows.length === 0) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      user: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,  // <-- rôle ajouté ici
        
      },
    });
  } catch (err) {
    console.error("Login error:", err);
    res.status(500).json({ error: "Login failed", details: err.message || err });
  }
});

// 3. Test Route (for debugging)
router.get("/test", (req, res) => {
  res.json({ message: "Test route working" });
});

// 4. Check Email Route (used in signup form to check if email exists)
router.get("/check-email", async (req, res) => {
  const email = req.query.email;
  if (!email) return res.json({ exists: false });

  try {
    const [rows] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
    res.json({ exists: rows.length > 0 });
  } catch (err) {
    console.error("Check email error:", err);
    res.status(500).json({ error: "DB error", details: err.message || err });
  }
});

export default router;

