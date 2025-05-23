import React, { useEffect, useState } from "react";

function SellerDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({
    name: "",
    price: 0,
    category: "",
    location: "",
    expires_at: "",
    is_free: false,
  });
  const [editingProductId, setEditingProductId] = useState(null);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    const token = localStorage.getItem("token");
    if (!token) return;
    try {
      const res = await fetch("http://localhost:5000/api/products/seller", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      setProducts(data);
    } catch {
      showMessage("Failed to fetch products", true);
    }
  };

  const showMessage = (text, isError = false) => {
    if (isError) {
      setError(text);
      setMessage("");
    } else {
      setMessage(text);
      setError("");
    }
    setTimeout(() => {
      setMessage("");
      setError("");
    }, 3000);
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "is_free") {
      setForm((prev) => ({
        ...prev,
        is_free: checked,
        price: checked ? 0 : prev.price,
      }));
    } else {
      setForm((prev) => ({
        ...prev,
        [name]: type === "checkbox"
          ? checked
          : type === "number"
          ? value === "" ? "" : Number(value)
          : value,
      }));
    }
  };

  const resetForm = () => {
    setForm({
      name: "",
      price: 0,
      category: "",
      location: "",
      expires_at: "",
      is_free: false,
    });
    setEditingProductId(null);
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token) return alert("You must be logged in.");

    const body = {
      ...form,
      price: form.is_free ? 0 : form.price,
    };

    try {
      const res = await fetch("http://localhost:5000/api/products/seller", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const newProduct = await res.json();
      setProducts((prev) => [...prev, newProduct]);
      resetForm();
      showMessage("Product added!");
    } catch {
      showMessage("Add failed", true);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product.id);
    setForm({
      name: product.name || "",
      price: product.price || 0,
      category: product.category || "",
      location: product.location || "",
      expires_at: product.expires_at ? product.expires_at.split("T")[0] : "",
      is_free: product.is_free || false,
    });
  };

  const handleUpdateProduct = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("token");
    if (!token || !editingProductId) return;

    const body = {
      ...form,
      price: form.is_free ? 0 : form.price,
    };

    try {
      const res = await fetch(`http://localhost:5000/api/products/seller/${editingProductId}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const updatedProduct = await res.json();
      setProducts((prev) =>
        prev.map((p) => (p.id === editingProductId ? updatedProduct : p))
      );
      resetForm();
      showMessage("Product updated!");
    } catch {
      showMessage("Update failed", true);
    }
  };

  const handleDeleteProduct = async (id) => {
    const token = localStorage.getItem("token");
    if (!token || !id) return;
    const confirmDelete = window.confirm("Are you sure you want to delete this product?");
    if (!confirmDelete) return;

    try {
      await fetch(`http://localhost:5000/api/products/seller/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts((prev) => prev.filter((p) => p.id !== id));
      showMessage("Product deleted!");
    } catch {
      showMessage("Delete failed", true);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 800, margin: "auto", fontFamily: "Arial, sans-serif" }}>
      <h1>Seller Dashboard - Your Products</h1>

      {message && <div style={{ backgroundColor: "#d4edda", color: "#155724", padding: 10, borderRadius: 5 }}>{message}</div>}
      {error && <div style={{ backgroundColor: "#f8d7da", color: "#721c24", padding: 10, borderRadius: 5 }}>{error}</div>}

      <h2>{editingProductId ? "Edit Product" : "Add New Product"}</h2>
      <form onSubmit={editingProductId ? handleUpdateProduct : handleAddProduct}
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
          gap: 16,
          marginBottom: 30,
        }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} required style={{ padding: 8 }} />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} disabled={form.is_free} required={!form.is_free} style={{ padding: 8 }} />
        <select name="category" value={form.category} onChange={handleChange} required style={{ padding: 8 }}>
          <option value="">Category</option>
          <option value="fruits">Fruits</option>
          <option value="vegetables">Vegetables</option>
          <option value="dairy">Dairy</option>
          <option value="meat">Meat</option>
        </select>
        <input name="location" placeholder="Location" value={form.location} onChange={handleChange} required style={{ padding: 8 }} />
        <input name="expires_at" type="date" value={form.expires_at} onChange={handleChange} style={{ padding: 8 }} />
        <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
          Free:
          <input type="checkbox" name="is_free" checked={form.is_free} onChange={handleChange} />
        </label>
        <button type="submit" style={{ padding: "10px 20px", backgroundColor: "#12bb57", color: "#fff", border: "none", borderRadius: 5 }}>
          {editingProductId ? "Update Product" : "Add Product"}
        </button>
      </form>

      <h2>Your Products</h2>
      {products.length === 0 ? (
        <p>No products found.</p>
      ) : (
        <ul style={{ listStyle: "none", padding: 0 }}>
          {products.map((product) => (
            <li key={product.id} style={{ border: "1px solid #ddd", borderRadius: 5, padding: 12, marginBottom: 10, display: "flex", justifyContent: "space-between", flexWrap: "wrap" }}>
              <div style={{ flex: 1 }}>
                <strong>{product.name || "No name"}</strong>
                <p>Price: {product.is_free ? <span style={{ color: "green", fontWeight: "bold" }}>Free</span> : `${product.price} €`}</p>
                <p>Category: {product.category || "N/A"}</p>
                <p>Location: {product.location || "N/A"}</p>
                <p>Expires: {product.expires_at ? new Date(product.expires_at).toLocaleDateString() : "N/A"}</p>
              </div>
              <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                <button onClick={() => handleEditProduct(product)} style={{ backgroundColor: "#f0ad4e", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 4 }}>Modifier</button>
                <button onClick={() => handleDeleteProduct(product.id)} style={{ backgroundColor: "#d9534f", color: "#fff", border: "none", padding: "6px 12px", borderRadius: 4 }}>Supprimer</button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default SellerDashboard;
