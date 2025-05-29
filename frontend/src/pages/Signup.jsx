"use client"

import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import "./Auth.css"

const SIGNUP_API_URL = "${process.env.REACT_APP_API_URL}/api/users/signup"
const LOGIN_API_URL = "${process.env.REACT_APP_API_URL}/api/users/login"

function Signup({ onSignup }) {
  const navigate = useNavigate()

  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    password: "",
    role: "client",
  })

  const [error, setError] = useState("")

  // Cette fonction sera appelée à chaque montage du composant et à chaque rafraîchissement
  useEffect(() => {
    // Réinitialiser le formulaire
    setForm({
      first_name: "",
      last_name: "",
      email: "",
      password: "",
      role: "client",
    })

    // Effacer les champs du formulaire manuellement pour contourner l'auto-remplissage
    const firstNameInput = document.querySelector('input[name="first_name"]')
    const lastNameInput = document.querySelector('input[name="last_name"]')
    const emailInput = document.querySelector('input[name="email"]')
    const passwordInput = document.querySelector('input[name="password"]')

    if (firstNameInput) firstNameInput.value = ""
    if (lastNameInput) lastNameInput.value = ""
    if (emailInput) emailInput.value = ""
    if (passwordInput) passwordInput.value = ""
  }, [])

  const handleChange = (e) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError("")

    if (!form.first_name || !form.last_name || !form.email || !form.password) {
      setError("Please fill in all fields.")
      return
    }
    if (form.password.length < 5) {
      setError("Password must be at least 5 characters long.")
      return
    }

    try {
      // Signup
      const signupRes = await fetch(SIGNUP_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })
      const signupData = await signupRes.json()
      if (!signupRes.ok) {
        setError(signupData.error || "Signup failed.")
        return
      }

      // Auto-login after signup
      const loginRes = await fetch(LOGIN_API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, password: form.password }),
      })
      const loginData = await loginRes.json()
      if (!loginRes.ok) {
        setError(loginData.error || "Login failed after signup.")
        return
      }

      // Save JWT token and user info
      localStorage.setItem("token", loginData.token)
      localStorage.setItem("role", loginData.user.role)
      localStorage.setItem("user", JSON.stringify(loginData.user))

      // Notify parent component
      onSignup(loginData.user)

      // Redirect selon rôle
      if (loginData.user.role === "seller") {
        navigate("/seller-home")
      } else {
        navigate("/home")
      }
    } catch (err) {
      setError("An unexpected error occurred.")
      console.error(err)
    }
  }

  return (
    <div className="auth-bg">
      <form className="auth-form" onSubmit={handleSubmit} autoComplete="off">
        <h2 className="auth-title">Create an Account</h2>
        <p className="auth-desc">Start buying or selling with Waste Buster</p>

        <label className="auth-label">First Name</label>
        <input
          className="auth-input"
          type="text"
          name="first_name"
          value={form.first_name}
          onChange={handleChange}
          placeholder="First Name"
          autoComplete="new-first-name"
        />

        <label className="auth-label">Last Name</label>
        <input
          className="auth-input"
          type="text"
          name="last_name"
          value={form.last_name}
          onChange={handleChange}
          placeholder="Last Name"
          autoComplete="new-last-name"
        />

        <label className="auth-label">Email</label>
        <input
          className="auth-input"
          type="email"
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email address"
          autoComplete="new-email"
        />

        <label className="auth-label">Password</label>
        <input
          className="auth-input"
          type="password"
          name="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          autoComplete="new-password"
        />

        <div className="auth-label" style={{ margin: "15px 0 3px" }}>
          I am a:
        </div>
        <div style={{ display: "flex", justifyContent: "center", gap: 28 }}>
          <label style={{ fontWeight: 500 }}>
            <input type="radio" name="role" value="client" checked={form.role === "client"} onChange={handleChange} />{" "}
            Buyer
          </label>
          <label style={{ fontWeight: 500 }}>
            <input type="radio" name="role" value="seller" checked={form.role === "seller"} onChange={handleChange} />{" "}
            Seller
          </label>
        </div>

        {error && <div className="auth-error">{error}</div>}

        <button type="submit" className="auth-btn">
          Sign Up
        </button>

        <div className="auth-footer">
          Already have an account? <a href="/login">Login</a>
        </div>
      </form>
    </div>
  )
}

export default Signup
