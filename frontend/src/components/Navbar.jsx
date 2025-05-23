import React, { useState, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Navbar.css";


function stringToColor(str) {
  if (!str) return "#000000"; // valeur par défaut si str est undefined/null
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  const c = (hash & 0x00FFFFFF).toString(16).toUpperCase();
  return "#" + "00000".substring(0, 6 - c.length) + c;
}


function Navbar({ user, onLogout }) {
  const [dropdown, setDropdown] = useState(false);
  const ref = useRef(null);
  const navigate = useNavigate();

  React.useEffect(() => {
    const handleClick = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setDropdown(false);
    };
    document.addEventListener("mousedown", handleClick);
    return () => document.removeEventListener("mousedown", handleClick);
  }, []);

  const handleLogout = () => {
    setDropdown(false);
    onLogout();
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <div className="navbar-left">
        <img src="/wastebuster-logo.jpg" alt="Waste Buster Logo" className="nav-logo" />
        <span className="nav-title"><Link to="/">Waste Buster</Link></span>
      </div>
      <div className="navbar-right">
        <Link className="nav-link" to="/">Home</Link>
        <Link className="nav-link" to="/about">About</Link>
        <Link className="nav-link" to="/contact">Contact</Link>
        {!user ? (
          <>
            <Link className="nav-btn" to="/login">Sign In</Link>
            <Link className="nav-btn nav-btn-green" to="/signup">Sign Up</Link>
          </>
        ) : (
          <div className="nav-avatar-menu" ref={ref}>
            <button className="avatar-btn" onClick={() => setDropdown(!dropdown)}>
              <span className="avatar-circle" style={{ background: stringToColor(user.first_name || user.email) }}>
                {user.first_name ? user.first_name[0].toUpperCase() : "?"}
              </span>
              {/* Affiche seulement la première lettre, pas le nom complet */}
              {/* <span className="avatar-name">{user.first_name}</span>  <-- Supprimé pour éviter double icône */}
              <svg height="18" width="18" viewBox="0 0 24 24" className="chevron-down">
                <path fill="#12bb57" d="M7 10l5 5 5-5z" />
              </svg>
            </button>
            {dropdown && (
              <div className="dropdown-menu">
                <Link to="/favorites" onClick={() => setDropdown(false)} style={{ display: 'block', padding: '8px 15px', color: '#003820', fontWeight: 'bold', textDecoration: 'none' }}>
                  Mes favoris
                </Link>
                <button onClick={handleLogout}>Logout</button>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}

export default Navbar;
