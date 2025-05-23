import React, { useState } from "react";

export default function Contact() {
  const [formData, setFormData] = useState({ name: "", email: "", message: "" });
  const [sending, setSending] = useState(false);

  const handleChange = (e) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const validateEmail = (email) => {
    // Basic email regex validation
    return /\S+@\S+\.\S+/.test(email);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation before sending
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      alert("Please fill all the required fields.");
      return;
    }
    if (!validateEmail(formData.email)) {
      alert("Please enter a valid email address.");
      return;
    }

    setSending(true);

    try {
      // Simulate sending delay - replace this with real API call
      await new Promise((res) => setTimeout(res, 1500));

      alert("Your message has been sent successfully!");
      setFormData({ name: "", email: "", message: "" });
    } catch {
      alert("An error occurred. Please try again.");
    } finally {
      setSending(false);
    }
  };

  return (
    <>
      <style>{`
        .contact-container {
          max-width: 800px;
          margin: 2rem auto;
          padding: 2rem 1.5rem;
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          color: #1b2a1f;
        }
        h1 {
          text-align: center;
          color: #4caf50;
          margin-bottom: 2rem;
        }
        form {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        label {
          font-weight: 600;
        }
        input, textarea {
          padding: 0.6rem;
          border: 1.5px solid #a5d6a7;
          border-radius: 8px;
          font-size: 1rem;
          font-family: inherit;
          color: #1b2a1f;
          resize: vertical;
        }
        input:focus, textarea:focus {
          outline: none;
          border-color: #4caf50;
          box-shadow: 0 0 5px #4caf50;
          background-color: #e6fef2;
        }
        button {
          background-color: #81c784;
          color: #11220e;
          font-weight: 700;
          padding: 0.75rem;
          border-radius: 12px;
          cursor: pointer;
          border: none;
          user-select: none;
          transition: background-color 0.3s ease;
          max-width: 180px;
          align-self: center;
        }
        button:disabled {
          background-color: #c8e6c9;
          cursor: not-allowed;
        }
        .info-section {
          margin-top: 2rem;
          font-size: 1rem;
          color: #3c593f;
          text-align: center;
          user-select: text;
        }
        .map-container {
          margin-top: 2rem;
          width: 100%;
          height: 300px;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 10px rgb(0 0 0 / 0.1);
        }
        iframe {
          width: 100%;
          height: 100%;
          border: 0;
        }
      `}</style>

      <div className="contact-container">
        <h1>Contact Us</h1>
        <form onSubmit={handleSubmit} noValidate>
          <label htmlFor="name">Full Name</label>
          <input
            id="name"
            name="name"
            type="text"
            required
            placeholder="Your full name"
            value={formData.name}
            onChange={handleChange}
          />
          <label htmlFor="email">Email Address</label>
          <input
            id="email"
            name="email"
            type="email"
            required
            placeholder="Your email address"
            value={formData.email}
            onChange={handleChange}
          />
          <label htmlFor="message">Message</label>
          <textarea
            id="message"
            name="message"
            rows="5"
            required
            placeholder="Your message"
            value={formData.message}
            onChange={handleChange}
          />
          <button type="submit" disabled={sending}>
            {sending ? "Sending..." : "Send"}
          </button>
        </form>

        <div className="info-section">
          <p>Address: 10 rue de la Paix, Paris 75006</p>
          <p>Phone: +33 1 23 45 67 89</p>
        </div>

        <div className="map-container">
          <iframe
            title="Google Maps Paris"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2624.956866981601!2d2.3321598156741796!3d48.86563307928716!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e66fc2fa5a8a63%3A0x9b7c095e8b5c65ee!2s10%20Rue%20de%20la%20Paix%2C%2075006%20Paris%2C%20France!5e0!3m2!1sen!2sus!4v1684767130152!5m2!1sen!2sus"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </>
  );
}
