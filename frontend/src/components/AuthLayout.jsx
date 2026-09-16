import { Link } from "react-router-dom";
import Logo from "./Logo";

function AuthLayout({
  contextText,
  contextLinkText,
  contextLinkTo,
  image,
  imageOverlay,
  children,
}) {
  return (
    <div className="page auth-page-v2">

      {/* ================= HEADER ================= */}

      <header className="mini-header">

        <Link
          to="/"
          className="brand"
        >

          <Logo />

          <span className="brand-text">

            <strong>
              CampusNest
            </strong>

            <small>
              Find Your Perfect Stay
            </small>

          </span>

        </Link>


        <p className="mini-header-link">

          {contextText}{" "}

          <Link to={contextLinkTo}>
            {contextLinkText}
          </Link>

        </p>

      </header>


      {/* ================= AUTH CONTENT ================= */}

      <main className="auth-center">

        <div className="auth-card">


          {/* ================= IMAGE ================= */}

          <div className="auth-card-image">

            <img
              src={image}
              alt="CampusNest PG room"
            />

            {imageOverlay && (

              <p className="auth-card-overlay">

                {imageOverlay}

              </p>

            )}

          </div>


          {/* ================= FORM ================= */}

          <div className="auth-card-form">

            {children}

          </div>

        </div>

      </main>

    </div>
  );
}

export default AuthLayout;