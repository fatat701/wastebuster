"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./Auth.css"

const API_URL = "http://localhost:5000/api/users/login"

function Login({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" })
  const [error, setError] = useState("")
  const navigate = useNavigate()

  // Cette fonction sera appelée à chaque montage du composant et à chaque rafraîchissement
  useEffect(() => {
    // Réinitialiser le formulaire
    setForm({ email: "", password: "" })

    // Effacer les champs du formulaire manuellement pour contourner l'auto-remplissage
    const emailInput = document.querySelector('input[name="email"]')
    const passwordInput = document.querySelector('input[name="password"]')

    if (emailInput) emailInput.value = ""
    if (passwordInput) passwordInput.value = ""
  }, [])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!form.email || !form.password) {
      setError("Please fill in all fields.")
      return
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || "Login failed.")
        return
      }

      // Save token and user info
      localStorage.setItem("token", data.token)
      localStorage.setItem("user", JSON.stringify(data.user))
      localStorage.setItem("role", data.user.role)

      // Notify parent
      onLogin(data.user)

      // Redirect selon rôle
      if (data.user.role === "seller") {
        navigate("/seller-home")
      } else {
        navigate("/home")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
      console.error("Login error:", err)
    } finally {
      // Vider les champs après soumission
      setForm({ email: "", password: "" })
    }
  }

  return (
    <div className="auth-bg">
      <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
        <h2 className="auth-title">Sign In</h2>
        <p className="auth-desc">WELCOME TO WASTEBUSTER !</p>

        <label className="auth-label">Email</label>
        <input
          className="auth-input"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email address"
          autoComplete="new-email" // Trompe le navigateur pour éviter l'auto-remplissage
          autoFocus
        />

        <label className="auth-label">Password</label>
        <input
          className="auth-input"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          autoComplete="new-password" // Trompe le navigateur pour éviter l'auto-remplissage
        />

        {error && <div className="auth-error">{error}</div>}

        <button type="submit" className="auth-btn">
          Sign In
        </button>

        <div className="auth-footer">
          Don't have an account? <a href="/signup">Sign Up</a>
        </div>
      </form>
    </div>
  )
}

export default Login
