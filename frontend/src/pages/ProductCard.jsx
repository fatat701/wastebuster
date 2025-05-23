import React, { useState, useEffect } from "react";

export default function ProductCard({ product, token, favorites, setFavorites }) {
  const isFavorite = favorites.some(fav => fav.product_id === product.id);

  const toggleFavorite = async () => {
    if (!token) return alert("Please login");

    try {
      if (isFavorite) {
        // Supprimer favori
        const favItem = favorites.find(fav => fav.product_id === product.id);
        await fetch(`/api/favorites/${favItem.id}`, {
          method: "DELETE",
          headers: { Authorization: `Bearer ${token}` },
        });
        setFavorites(favorites.filter(fav => fav.id !== favItem.id));
      } else {
        // Ajouter favori
        const res = await fetch("/api/favorites", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ product_id: product.id }),
        });
        if (res.ok) {
          const newFav = await res.json();
          // Recharger favoris (ou juste ajouter localement)
          setFavorites([...favorites, { product_id: product.id, id: newFav.id }]);
        }
      }
    } catch (err) {
      console.error(err);
      alert("Erreur gestion favori");
    }
  };

  return (
    <div className="product-card">
      <h3>{product.name}</h3>
      <button onClick={toggleFavorite} aria-label="Toggle favorite">
        {isFavorite ? "❤️" : "🤍"}
      </button>
    </div>
  );
}
