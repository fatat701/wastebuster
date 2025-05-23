import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import userRoutes from "./routes/users.js"; // Adjust path and filename as needed!
import productRoutes from "./routes/products.js";
import orderRoutes from "./routes/orders.js";
import favoriteRoutes from "./routes/favorites.js";
import sellerProductRoutes from "./routes/sellerProducts.js"; // ou le nom que tu as donné

dotenv.config();
const app = express();

app.use(cors());
app.use(express.json());

// Here you "mount" your route files!
app.use("/api/users", userRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/favorites", favoriteRoutes);
app.use("/api/products/seller", sellerProductRoutes);

app.get("/", (req, res) => {
  res.send("WasteBuster API is running");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
