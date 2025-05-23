import { db } from "../config/db.js";

export const getAllProducts = async (req, res) => {
  const [rows] = await db.query("SELECT * FROM products ORDER BY created_at DESC");
  res.json(rows);
};

export const addProduct = async (req, res) => {
  const {
    name,
    category,
    image_url,
    price,
    is_free,
    location,
    expires_at,
  } = req.body;
  const seller_id = req.user.id;

  await db.query(
    "INSERT INTO products (name, category, image_url, price, is_free, location, expires_at, seller_id, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())",
    [name, category, image_url, price, is_free ? 1 : 0, location, expires_at, seller_id]
  );
  res.status(201).json({ message: "Product added" });
};

export const filterProducts = async (req, res) => {
  const { category, maxPrice, sort } = req.query;
  let query = "SELECT * FROM products WHERE 1=1";
  const params = [];
  if (category) {
    query += " AND category = ?";
    params.push(category);
  }
  if (maxPrice) {
    query += " AND price <= ?";
    params.push(maxPrice);
  }
  if (sort === "asc") query += " ORDER BY price ASC";
  else if (sort === "desc") query += " ORDER BY price DESC";
  const [rows] = await db.query(query, params);
  res.json(rows);
};
