import express from "express";
import {
  getAllProducts,
  addProduct,
  filterProducts,
} from "../controllers/products.js";
import jwt from "jsonwebtoken";

const router = express.Router();

const verifySeller = (req, res, next) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "seller") return res.status(403).json({ error: "Forbidden" });
    req.user = decoded;
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
};

router.get("/", getAllProducts);
router.get("/filter", filterProducts);
router.post("/", verifySeller, addProduct);

export default router;
