import { useState, useEffect } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";

const sellerAvatars = [
  "https://randomuser.me/api/portraits/men/32.jpg",
  "https://randomuser.me/api/portraits/women/44.jpg",
  "https://randomuser.me/api/portraits/men/65.jpg",
  "https://randomuser.me/api/portraits/women/22.jpg",
];

const categoryImages = {
  "": "https://cdn-icons-png.flaticon.com/512/1946/1946433.png",
  fruits: "https://cdn-icons-png.flaticon.com/512/415/415733.png",
  legumes: "../public/legume.png",
  pain: "https://cdn-icons-png.flaticon.com/512/1046/1046750.png",
  laitiers: "../public/laitier.png",
  boissons: "https://cdn-icons-png.flaticon.com/512/415/415759.png",
};

const exampleProducts = [
  {
    id: 36,
    name: "Pommes rouges",
    category: "fruits",
    images: ["../public/pomme.jpg"],
    price: 3.5,
    is_free: false,
    location: "Lyon, 69001",
    expires_at: "2025-06-30",
    seller_avatar: sellerAvatars[0],
    seller_verified: true,
  },
  {
    id: 37,
    name: "Pineapple",
    category: "fruits",
    images: ["../public/ananas.webp"],
    price: 3.5,
    is_free: false,
    location: "Lyon, 69001",
    expires_at: "2025-06-30",
    seller_avatar: sellerAvatars[0],
    seller_verified: true,
  },
  {
    id: 38,
    name: "Panier de légumes bio",
    category: "legumes",
    images: ["../public/l.jpg"],
    price: 8.0,
    is_free: false,
    location: "Paris, 75020",
    expires_at: "2025-07-15",
    seller_avatar: sellerAvatars[1],
    seller_verified: true,
  },
  {
    id: 39,
    name: "Salade",
    category: "legumes",
    images: ["../public/salade.jpg"],
    price: "",
    is_free: true,
    location: "Paris, 75015",
    expires_at: "2025-07-15",
    seller_avatar: sellerAvatars[1],
    seller_verified: true,
  },
  {
    id: 40,
    name: "Pain au levain",
    category: "pain",
    images: ["../public/painL.jpeg"],
    price: 2.5,
    is_free: false,
    location: "Paris, 75011",
    expires_at: "2025-07-20",
    seller_avatar: sellerAvatars[2],
    seller_verified: true,
  },
  {
    id: 41,
    name: "Yaourts nature",
    category: "laitiers",
    images: ["../public/Yagourt.jpg"],
    price: 0,
    is_free: true,
    location: "Paris, 75011",
    expires_at: "2025-09-30",
    seller_avatar: sellerAvatars[3],
    seller_verified: true,
  },
  {
    id: 42,
    name: "Cheese",
    category: "laitiers",
    images: ["../public/cheese.jpg"],
    price: 3.5,
    is_free: true,
    location: "Paris, 7501",
    expires_at: "2025-07-30",
    seller_avatar: sellerAvatars[0],
    seller_verified: true,
  },
  {
    id: 43,
    name: "Jus d'orange frais",
    category: "boissons",
    images: ["../public/Jus Orange.webp"],
    price: 4.5,
    is_free: false,
    location: "Marseille, 13001",
    expires_at: "2025-06-20",
    seller_avatar: sellerAvatars[0],
    seller_verified: true,
  },
  {
    id: 44,
    name: "Nescafe",
    category: "boissons",
    images: ["../public/nescafe.jpg"],
    price: 9.5,
    is_free: false,
    location: "Paris , 75018",
    expires_at: "2027-06-20",
    seller_avatar: sellerAvatars[3],
    seller_verified: true,
  },
];

const categories = [
  { id: "", name: "Toutes catégories" },
  { id: "fruits", name: "Fruits" },
  { id: "legumes", name: "Légumes" },
  { id: "pain", name: "Pain" },
  { id: "laitiers", name: "Produits laitiers" },
  { id: "boissons", name: "Boissons" },
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

export default function HomeContent() {
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [products, setProducts] = useState(exampleProducts);
  const [category, setCategory] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [maxPrice, setMaxPrice] = useState(10);

  const [favorites, setFavorites] = useState([]);
  const token = localStorage.getItem("token");

  // Load favorites for logged-in user
  useEffect(() => {
    if (token) {
    fetch("http://localhost:5000/api/favorites", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((res) => res.json())
      .then((data) => {
        const favIds = data.map((p) => p.id);
        setFavorites(favIds);
      })
      .catch(() => setFavorites([]));
  } else {
    setFavorites([]);  // Important : vide les favoris si pas connecté
  }
}, [token]);
  // Add or remove favorite
  const toggleFavorite = async (productId) => {
  if (!token) {
    alert("Veuillez vous connecter pour gérer vos favoris.");
    return; // Stop early, no UI change happens
  }
  const isFavorited = favorites.includes(productId);

  try {
    if (isFavorited) {
      const res = await fetch(`http://localhost:5000/api/favorites/${productId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Erreur lors de la suppression du favori");
      // Only update UI after backend success
      setFavorites(favorites.filter((id) => id !== productId));
    } else {
      const res = await fetch("http://localhost:5000/api/favorites", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ product_id: productId }),
      });
      if (!res.ok) throw new Error("Erreur lors de l'ajout du favori");
      // Only update UI after backend success
      setFavorites((prev) => [...prev, productId]);
    }
  } catch (err) {
    alert(err.message);
  }
};

  // Filter products by category, max price and search term
  useEffect(() => {
    let filtered = exampleProducts;
    if (category) filtered = filtered.filter((p) => p.category === category);
    if (maxPrice !== null) filtered = filtered.filter((p) => p.price <= maxPrice);
    if (searchTerm.trim() !== "")
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    setProducts(filtered);
  }, [category, maxPrice, searchTerm]);

  // Add product to cart and navigate to payment page
  const handleReserve = (product) => {
    addToCart(product, 1);
    navigate("/payment");
  };

  return (
    <>
      <style>{`
        /* Your CSS here, exactly as you want it */
        * {
          box-sizing: border-box;
        }
        body, html, #root {
          margin: 0; padding: 0; height: 100%;
          background-color: #e6fef2;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #1b2a1f;
        }
        .home-container {
          display: flex;
          gap: 2rem;
          padding: 1rem 3rem;
          min-height: calc(100vh - 64px);
          background-color: #e6fef2;
        }
        .left-sidebar {
          width: 250px;
          background: #224422;
          border-radius: 12px;
          padding: 1.5rem;
          font-weight: 700;
          color: #a5d6a7;
          box-shadow: 0 4px 10px rgb(0 0 0 / 0.2);
          user-select: none;
          height: fit-content;
        }
        .left-sidebar h3 {
          margin-bottom: 1.5rem;
          font-size: 1.5rem;
          text-align: center;
          color: #a5d6a7;
        }
        .category-item {
          display: flex;
          align-items: center;
          padding: 0.5rem 0.75rem;
          border-radius: 10px;
          margin-bottom: 0.7rem;
          cursor: pointer;
          transition: background-color 0.3s ease;
          color: #dcedc8;
          font-size: 1.1rem;
        }
        .category-item:hover {
          background-color: #4caf5080;
        }
        .category-item.active {
          background-color: #81c784;
          color: #11220e;
          font-weight: 800;
        }
        .category-item img {
          width: 30px;
          height: 30px;
          margin-right: 12px;
          object-fit: contain;
          border-radius: 5px;
        }
        .right-content {
          flex: 1;
          display: flex;
          flex-direction: column;
        }
        .filters {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
          align-items: center;
          flex-wrap: wrap;
          padding: 0.5rem 1rem;
          background-color: white;
          border-radius: 12px;
          box-shadow: 0 3px 6px rgb(0 0 0 / 0.1);
        }
        .filters input[type="text"] {
          padding: 0.5rem 1rem;
          border-radius: 12px;
          border: 1.5px solid #a5d6a7;
          font-size: 1rem;
          flex: 1;
          min-width: 220px;
          color: #1b2a1f;
          transition: border-color 0.2s ease;
        }
        .filters input[type="text"]:focus {
          outline: none;
          border-color: #4caf50;
          box-shadow: 0 0 5px #4caf50;
          background-color: #e6fef2;
        }
        .filters label {
          color: #1b2a1f;
          font-weight: 600;
          white-space: nowrap;
          user-select: none;
        }
        .filters input[type="range"] {
          cursor: pointer;
          width: 160px;
          accent-color: #4caf50;
          margin-left: 0.3rem;
        }
         .product-list {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
          gap: 1rem;
          justify-content: center;
          justify-items: center;
        }
        .images-gallery {
          display: flex;
          gap: 6px;
          justify-content: center;
          margin-bottom: 12px;
          position: relative;
        }
        .images-gallery img {
          width: 110px;
          height: 110px;
          object-fit: cover;
          border-radius: 10px;
          border: 1px solid #ddd;
          transition: transform 0.3s ease;
          cursor: pointer;
        }
        .images-gallery img:hover {
          transform: scale(1.05);
          box-shadow: 0 6px 12px rgba(0,0,0,0.15);
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
          color: #4caf50;
          font-size: 0.9rem;
          margin-top: 6px;
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
        .reserve-button {
          background-color: #81c784;
          color: #11220e;
          font-weight: 700;
          padding: 0.5rem 1.2rem;
          border-radius: 14px;
          cursor: pointer;
          border: none;
          user-select: none;
          align-self: center;
          transition: background-color 0.3s ease;
        }
        .reserve-button:hover {
          background-color: #4caf50;
          color: white;
        }
        .favorite-button {
          position: absolute;
          top: 8px;
          right: 8px;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 22px;
          user-select: none;
          color: white;
          text-shadow: 0 0 5px black;
          padding: 0;
          line-height: 1;
        }
        .favorite-button.favorited {
          color: red;
        }
        @media (max-width: 860px) {
          .home-container {
            flex-direction: column;
            padding: 1rem 1.5rem;
          }
          .left-sidebar {
            width: 100%;
            margin-bottom: 1.2rem;
            display: flex;
            justify-content: center;
            flex-wrap: wrap;
          }
          .category-item {
            margin: 0.4rem;
            flex: 1 1 40%;
            justify-content: center;
            font-size: 1.2rem;
          }
          .filters {
            flex-direction: column;
            gap: 0.75rem;
          }
          .filters input[type="text"] {
            min-width: 100%;
          }
          .product-list {
            grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
            justify-items: center;
          }
          .product-card {
            width: 100%;
            min-height: auto;
          }
          .images-gallery img {
            width: 100px;
            height: 100px;
          }
        }
      `}</style>

      <div className="home-container">
        <aside className="left-sidebar" aria-label="Liste des catégories">
          <h3>Catégories</h3>
          {categories.map((cat) => (
            <div
              key={cat.id || "all"}
              className={`category-item ${category === cat.id ? "active" : ""}`}
              onClick={() => setCategory(cat.id)}
              role="button"
              tabIndex={0}
              onKeyPress={(e) => {
                if (e.key === "Enter") setCategory(cat.id);
              }}
            >
              <img
                src={categoryImages[cat.id || ""]}
                alt={cat.name}
                loading="lazy"
                width={30}
                height={30}
                style={{ marginRight: 12, borderRadius: 5 }}
              />
              {cat.name}
            </div>
          ))}
        </aside>

        <main className="right-content">
          <div className="filters" role="search">
            <input
              type="text"
              aria-label="Recherche produit"
              placeholder="Rechercher un produit..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              autoComplete="off"
            />

            <label htmlFor="maxPriceSlider">Prix max : {maxPrice} €</label>
            <input
              id="maxPriceSlider"
              type="range"
              min="0"
              max="10"
              step="0.1"
              value={maxPrice}
              onChange={(e) => setMaxPrice(Number.parseFloat(e.target.value))}
            />
          </div>

          {products.length === 0 ? (
            <div className="no-products" role="alert">
              Aucun produit trouvé
            </div>
          ) : (
            <div className="product-list" role="list">
              {products.map((product) => {
                const isFavorited = favorites.includes(product.id);

                return (
                  <article
                    className="product-card"
                    key={product.id}
                    role="listitem"
                    tabIndex={0}
                  >
                    <div className="images-gallery" style={{ position: "relative" }}>
                      {product.images.map((imgUrl, idx) => (
                        <img
                          key={idx}
                          src={imgUrl}
                          alt={`${product.name} image ${idx + 1}`}
                          loading="lazy"
                        />
                      ))}

 <button
  className={`favorite-button ${isFavorited ? "favorited" : ""}`}
  onClick={() => toggleFavorite(product.id)}
  aria-label={isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
  title={isFavorited ? "Retirer des favoris" : "Ajouter aux favoris"}
  disabled={!token}  // <-- désactive si pas de token
  style={{ cursor: token ? "pointer" : "not-allowed" }}
>
  {isFavorited ? "❤️" : "🤍"}
</button>


                    </div>

                    <div className="product-info">
                      <h4>{product.name}</h4>
                      <p>
                        Prix :{" "}
                        {product.is_free ? (
                          <strong>Gratuit</strong>
                        ) : (
                          product.price.toFixed(2) + " €"
                        )}
                      </p>
                      <p>Lieu : {product.location}</p>
                      <p
                        className="expire-date"
                        style={{ color: calculateExpireColor(product.expires_at) }}
                      >
                        Expire le :{" "}
                        {product.expires_at
                          ? new Date(product.expires_at).toLocaleDateString()
                          : "Pas d'expiration"}
                      </p>
                    </div>

                    <div
                      className="seller-avatar-container"
                      title="Vendeur"
                      aria-label="Avatar vendeur"
                    >
                      <img
                        src={product.seller_avatar}
                        alt="Avatar vendeur"
                        className="seller-avatar"
                        loading="lazy"
                      />
                      {product.seller_verified && (
                        <div className="verified-badge">✔</div>
                      )}
                    </div>

                    <button
                      className="reserve-button"
                      onClick={() => handleReserve(product)}
                    >
                      Réserver
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </main>
      </div>
    </>
  );
}
