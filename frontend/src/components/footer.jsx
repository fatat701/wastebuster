import "./Footer.css"

function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-block">
        <div className="footer-title">Waste Buster</div>
        <div className="footer-desc">Reducing food waste by connecting sellers and buyers.</div>
        <nav className="footer-links">
          <a href="/" className="footer-link">
            Home
          </a>
          <a href="/about" className="footer-link">
            About
          </a>
          <a href="/contact" className="footer-link">
            Contact
          </a>
        </nav>
      </div>
    </footer>
  )
}

export default Footer
