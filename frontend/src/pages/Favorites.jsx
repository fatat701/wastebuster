import { useState, useEffect } from "react";

const sellerAvatars = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/65.jpg",
  "https://randomuser.me/api/portraits/women/22.jpg",
];

function calculateExpireColor(expires_at) {
  if (!expires_at) return "#4caf50";
  const now = new Date();
  const expireDate = new Date(expires_at);
  const diffDays = Math.ceil((expireDate - now) / (1000 * 60 * 60 * 24));
  if (diffDays <= 3) return "#e53935";
  if (diffDays <= 7) return "#fb8c00";
  return "#4caf50";
}

export default function Favorites() {
  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return;
    fetch("${process.env.REACT_APP_API_URL}/api/favorites", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch favorites");
        return res.json();
      })
      .then((data) => {
        setFavorites(data);
      })
      .catch(() => setFavorites([]));
  }, [token]);

  const removeFavorite = async (productId) => {
    if (!token) {
      alert("Please login to remove favorites.");
      return;
    }
    try {
      const res = await fetch(`${process.env.REACT_APP_API_URL}/api/favorites/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });
      if (!res.ok) throw new Error("Failed to remove favorite");
      setFavorites((prev) => prev.filter((fav) => fav.id !== productId));
    } catch (error) {
      alert(error.message);
    }
  };

  if (!token) {
    return <p>Please login to see your favorites.</p>;
  }

  if (favorites.length === 0) {
    return <p>You have no favorites yet.</p>;
  }

  return (
    <>
      <style>{`
        .product-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1rem;
          justify-content: center;
          justify-items: center;
          padding: 1rem;
        }
        .product-card {
          width: 200px;
          min-height: 350px;
          padding: 1rem;
          border-radius: 12px;
          box-shadow: 0 4px 8px rgb(0 0 0 / 0.12);
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          box-sizing: border-box;
          background: white;
          position: relative;
        }
        .images-gallery img {
          width: 110px;
          height: 110px;
          object-fit: cover;
          border-radius: 10px;
          border: 1px solid #ddd;
          cursor: pointer;
        }
        .product-info {
          text-align: center;
          margin-bottom: 10px;
        }
        .product-info h4 {
          font-weight: 900;
          color: #3c593f;
          margin: 0 0 0.4rem 0;
          font-size: 1.3rem;
        }
        .product-info p {
          margin: 0.2rem 0;
          font-weight: 600;
          font-size: 1rem;
          color: #1b2a1f;
        }
        .expire-date {
          font-weight: 700;
          font-size: 0.9rem;
          margin-top: 6px;
          color: inherit;
        }
        .seller-avatar-container {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 1rem;
          position: relative;
          gap: 6px;
        }
        .seller-avatar {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          border: 2.5px solid #81c784;
          box-shadow: 0 0 5px #81c784bb;
          object-fit: cover;
          background-color: white;
        }
        .verified-badge {
          background-color: #4caf50;
          border-radius: 50%;
          color: white;
          width: 18px;
          height: 18px;
          font-weight: bold;
          display: flex;
          justify-content: center;
          align-items: center;
          border: 2px solid white;
          user-select: none;
          font-size: 14px;
        }
        .remove-fav-btn {
          position: absolute;
          top: 8px;
          right: 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 24px;
          color: #d32d2d;
          user-select: none;
        }
        .remove-fav-btn:hover {
          color: #a00;
        }
      `}</style>

      <div className="product-list" role="list">
        {favorites.map((product) => (
          <article
            key={product.id}
            className="product-card"
            role="listitem"
            tabIndex={0}
          >
            <button
              className="remove-fav-btn"
              onClick={() => removeFavorite(product.id)}
              aria-label={`Remove ${product.name} from favorites`}
              title="Remove from favorites"
            >
              &times;
            </button>
            <div className="images-gallery">
  <img
    src={
      Array.isArray(product.images)
        ? product.images[0]
        : JSON.parse(product.images)[0]
    }
    alt={product.name}
    loading="lazy"
  />
</div>

            <div className="product-info">
              <h4>{product.name}</h4>
              <p>
                Prix : {product.is_free ? (
                  <strong>Gratuit</strong>
                ) : (
                  `${parseFloat(product.price).toFixed(2)} €`
                )}
              </p>
              <p>Lieu : {product.location}</p>
              <p
                className="expire-date"
                style={{ color: calculateExpireColor(product.expires_at) }}
              >
                Expire le : {product.expires_at ? new Date(product.expires_at).toLocaleDateString() : "Pas d'expiration"}
              </p>
            </div>

            <div className="seller-avatar-container" title="Vendeur" aria-label="Avatar vendeur">
              <img
                src={sellerAvatars[(product.seller_id - 1) % sellerAvatars.length]}
                alt="Avatar vendeur"
                className="seller-avatar"
                loading="lazy"
              />
              {product.seller_verified && <div className="verified-badge">✔</div>}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
