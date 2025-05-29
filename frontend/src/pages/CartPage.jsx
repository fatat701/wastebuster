import React, { useState } from "react";
import { useCart } from "./CartContext";
import { useNavigate } from "react-router-dom";
import { Trash2 } from "lucide-react"; // at the top of your file
export default function CartPage({ user }) {
  const { cart, removeFromCart, clearCart } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("card");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");

  const totalPrice = cart.reduce(
    (sum, item) => sum + (item.product.is_free ? 0 : item.product.price * item.quantity),
    0
  );

  const handleCheckout = async () => {
  if (!token) {
    alert("Veuillez vous connecter avant de réserver.");
    return;
  }
  if (cart.length === 0) {
    alert("Votre panier est vide.");
    return;
  }

  setLoading(true);
  try {
    const body = {
      cart: cart.map(item => ({
        product_id: item.product.id,
        quantity: item.quantity
      })),
      paymentMethod: paymentMethod,
    };

    const res = await fetch("http://localhost:5000/api/orders/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Erreur inconnue");
    }

    alert("Réservation confirmée !");
    clearCart();
    navigate("/");
  } catch (err) {
    alert("La réservation a échoué : " + err.message);
  } finally {
    setLoading(false);
  }
};


  return (
    <>
      <style>{`
        .cart-container {
          max-width: 700px;
          margin: 2rem auto;
          padding: 1rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #1b2a1f;
        }
        h2 {
          margin-bottom: 1.5rem;
          color: #4caf50;
          font-weight: 700;
          font-size: 2rem;
          text-align: center;
        }
        .cart-item {
          border: 1px solid #81c784;
          border-radius: 12px;
          padding: 1rem;
          margin-bottom: 1rem;
          box-shadow: 0 4px 10px rgb(0 0 0 / 0.1);
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
          background: white;
        }
        .cart-item strong {
          font-size: 1.25rem;
          color: #3c593f;
        }
        .cart-item p {
          margin: 0;
          font-weight: 600;
        }
        .remove-button {
          background-color: transparent;
          border: none;
          color: #e53935;
          font-weight: 700;
          cursor: pointer;
          align-self: flex-start;
          padding: 0;
          font-size: 1rem;
          transition: color 0.3s ease;
        }
        .remove-button:hover {
          color: #b71c1c;
        }
        .total {
          font-weight: 700;
          font-size: 1.5rem;
          margin-top: 2rem;
          margin-bottom: 1rem;
          text-align: right;
          color: #2e7d32;
        }
        .payment-options {
          display: flex;
          gap: 1.5rem;
          justify-content: center;
          margin-bottom: 1.5rem;
          font-weight: 600;
          color: #1b2a1f;
        }
        .payment-options label {
          cursor: pointer;
          user-select: none;
        }
        button.confirm-button {
          display: block;
          width: 100%;
          max-width: 280px;
          margin: 0 auto;
          background-color: #81c784;
          color: #11220e;
          font-weight: 700;
          padding: 0.75rem;
          border-radius: 14px;
          border: none;
          cursor: pointer;
          transition: background-color 0.3s ease;
          user-select: none;
        }
        button.confirm-button:hover:enabled {
          background-color: #4caf50;
          color: white;
        }
        button.confirm-button:disabled {
          background-color: #c8e6c9;
          cursor: not-allowed;
          color: #667c5a;
        }
      `}</style>

      <div className="cart-container" role="region" aria-label="Panier">
        <h2>Votre Panier</h2>

        {cart.length === 0 && <p>Votre panier est vide.</p>}

        {cart.map(({ product, quantity }) => (
          <div className="cart-item" key={product.id}>
            <strong>{product.name}</strong>
            <p>Prix : {product.is_free ? "Gratuit" : product.price.toFixed(2) + " €"}</p>
            
            <button
  className="remove-button"
  onClick={() => removeFromCart(product.id)}
  aria-label={`Supprimer ${product.name} du panier`}
>
  <Trash2 className="w-5 h-5" />
</button>
          </div>
        ))}

        <div className="total" aria-live="polite" aria-atomic="true">
          Total : {totalPrice.toFixed(2)} €
        </div>

        <form className="payment-options" onSubmit={(e) => e.preventDefault()}>
          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="card"
              checked={paymentMethod === "card"}
              onChange={() => setPaymentMethod("card")}
            />
            Carte bancaire
          </label>

          <label>
            <input
              type="radio"
              name="paymentMethod"
              value="cash"
              checked={paymentMethod === "cash"}
              onChange={() => setPaymentMethod("cash")}
            />
            Paiement en espèces
          </label>
        </form>

        <button
          className="confirm-button"
          onClick={handleCheckout}
          disabled={loading || cart.length === 0}
        >
          {loading ? "Traitement..." : "Confirmer la réservation"}
        </button>
      </div>
    </>
  );
}
