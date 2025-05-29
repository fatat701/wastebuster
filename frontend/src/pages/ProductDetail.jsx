import React from "react";
import { useParams, useNavigate } from "react-router-dom";

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = React.useState(null);
  const token = localStorage.getItem("token");

  React.useEffect(() => {
    fetch(`${process.env.REACT_APP_API_URL}/api/products/${id}`)
      .then((res) => res.json())
      .then(setProduct);
  }, [id]);

  const addFavorite = () => {
    if (!token) return alert("Veuillez vous connecter");
    fetch("${process.env.REACT_APP_API_URL}/api/favorites", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ product_id: product.id }),
    }).then(() => alert("Produit ajouté aux favoris"));
  };

  const goToPayment = () => {
    navigate("/payment", { state: { product } });
  };

  if (!product) return <div>Chargement...</div>;

  return (
    <div>
      <h1>{product.name}</h1>
      <img src={product.image_url} alt={product.name} width={300} />
      <p>Prix : {product.is_free ? "Gratuit" : product.price.toFixed(2) + " €"}</p>
      <p>Lieu : {product.location}</p>

      <button onClick={addFavorite}>Ajouter aux favoris</button>
      <button onClick={goToPayment}>Payer</button>
    </div>
  );
}
