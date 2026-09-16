import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/useAuth";
import { LogoutIcon, UserIcon } from "./icons";
import Logo from "./Logo";

function Navbar({ minimal = false }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header className="site-header">
      <div className="site-header-inner">
        <Link to="/" className="brand">
          <Logo />
          <span className="brand-text">
            <strong>CampusNest</strong>
            <small>Find Your Perfect Stay</small>
          </span>
        </Link>

        {!minimal && (
          <nav className="site-nav">
            <Link to="/" className="site-nav-active">
              Home
            </Link>
            <a href="/#pg-listings">Nearby PGs</a>
            <a href="/#how-it-works">How it works</a>
          </nav>
        )}

        <div className="site-header-actions">
          {user ? (
            <>
              <div className="user-chip">
                <span className="user-avatar">
                  {(user.name || "U").charAt(0).toUpperCase()}
                </span>
                <span className="user-chip-text">
                  <strong>{user.name || "User"}</strong>
                  <small>{user.role === "OWNER" ? "PG Owner" : "Student"}</small>
                </span>
              </div>
              <button className="btn btn-outline btn-sm" onClick={handleLogout}>
                <LogoutIcon /> Log Out
              </button>
            </>
          ) : (
            <>
              {!minimal && (
                <Link to="/login" className="user-icon-link" aria-label="Login">
                  <UserIcon />
                </Link>
              )}
              <Link to="/login" className="btn btn-outline btn-sm">
                Login
              </Link>
              <Link to="/register" className="btn btn-primary btn-sm">
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

export default Navbar;
