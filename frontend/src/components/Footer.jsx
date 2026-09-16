import { Link } from "react-router-dom";
import Logo from "./Logo";
import { InstagramIcon, MailIcon, WhatsAppIcon } from "./icons";

function Footer() {
  return (
    <footer className="site-footer">
      <div className="site-footer-inner">
        <div className="footer-brand">
          <Logo size={34} />
          <div>
            <strong>CampusNest</strong>
            <p>Find Your Perfect Stay</p>
          </div>
        </div>

        <nav className="footer-links">
          <a href="/#college-search">Search by College</a>
          <a href="/#pg-listings">PG Listings</a>
          <a href="/#how-it-works">How it works</a>
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          <Link to="/register" state={{ role: "OWNER" }}>
            List your PG
          </Link>
        </nav>

        <div className="footer-social">
          <button type="button" className="social-icon" aria-label="Instagram (coming soon)">
            <InstagramIcon />
          </button>
          <button type="button" className="social-icon" aria-label="WhatsApp (coming soon)">
            <WhatsAppIcon />
          </button>
          <button type="button" className="social-icon" aria-label="Email (coming soon)">
            <MailIcon />
          </button>
        </div>
      </div>
      <p className="footer-copy">© {new Date().getFullYear()} CampusNest. All rights reserved.</p>
    </footer>
  );
}

export default Footer;
