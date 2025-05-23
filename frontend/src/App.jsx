import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import About from "./pages/About";
import Contact from "./pages/Contact";
import ProductDetails from "./pages/ProductDetail";
import Payment from "./pages/CartPage";
import Favorites from "./pages/Favorites";
import SellerHome from "./pages/SellerHome";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) setUser(JSON.parse(storedUser));
  }, []);

  const handleLogin = (userObj) => {
    setUser(userObj);
    localStorage.setItem("user", JSON.stringify(userObj));
    localStorage.setItem("role", userObj.role);
  };

  const handleLogout = () => {
    setUser(null);
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    localStorage.removeItem("token");
  };

  return (
    <>
      <Navbar user={user} onLogout={handleLogout} />
      <div style={{ minHeight: "calc(100vh - 160px)" }}>
        <Routes>
          {/* Route racine, redirection selon rôle */}
          <Route
            path="/"
            element={
              user ? (
                user.role === "seller" ? (
                  <SellerHome user={user} />
                ) : (
                  <Home user={user} />
                )
              ) : (
                <Navigate to="/login" replace />
              )
            }
          />
          <Route
            path="/login"
            element={
              user ? <Navigate to="/" replace /> : <Login onLogin={handleLogin} />
            }
          />
          <Route
            path="/signup"
            element={
              user ? <Navigate to="/" replace /> : <Signup onSignup={handleLogin} />
            }
          />
          <Route path="/home" element={<Home user={user} />} />
          <Route path="/product/:id" element={<ProductDetails user={user} />} />
          <Route path="/payment" element={<Payment user={user} />} />
          <Route path="/about" element={<About />} />
          <Route path="/favorites" element={<Favorites user={user} />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
         <Footer />
    </>
  );
}

export default App;
