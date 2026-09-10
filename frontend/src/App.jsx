import { useEffect, useState } from "react";
import "./App.css";

const AUTH_API = "http://localhost:8081/api/auth";
const PG_API = "http://localhost:8082/api/pgs";

function App() {
  // home = Home Page
  // login = Login Page
  // register = Registration Page
  const [page, setPage] = useState("home");

  const [loggedInUser, setLoggedInUser] = useState(null);

  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const [registerData, setRegisterData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT",
  });

  const [searchData, setSearchData] = useState({
    city: "",
    minRent: "",
    maxRent: "",
    gender: "",
    minRooms: "",
  });

  const [pgs, setPgs] = useState([]);

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =====================================================
     LOAD ALL PGs
  ===================================================== */

  const loadPGs = async () => {
    try {
      const response = await fetch(PG_API);

      if (!response.ok) {
        throw new Error("Unable to load PGs");
      }

      const data = await response.json();

      setPgs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("PG loading error:", err);
      setPgs([]);
    }
  };

  /* =====================================================
     LOAD PGs WHEN HOME PAGE OPENS
  ===================================================== */

  useEffect(() => {
    if (page === "home") {
      loadPGs();
    }
  }, [page]);

  /* =====================================================
     GO TO LOGIN
  ===================================================== */

  const openLogin = () => {
    setPage("login");
    setError("");
    setMessage("");
  };

  /* =====================================================
     GO TO REGISTER
  ===================================================== */

  const openRegister = () => {
    setPage("register");
    setError("");
    setMessage("");
  };

  /* =====================================================
     LOGIN
  ===================================================== */

  const handleLogin = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    if (!loginData.email.trim()) {
      setError("Please enter your email.");
      return;
    }

    if (!loginData.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${AUTH_API}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: loginData.email.trim(),
          password: loginData.password,
        }),
      });

      if (!response.ok) {
        let errorText = "Invalid email or password.";

        try {
          const data = await response.text();

          if (data) {
            errorText = data;
          }
        } catch {
          // Keep default error message
        }

        throw new Error(errorText);
      }

      const user = await response.json();

      // Save logged-in user
      setLoggedInUser(user);

      // Clear login form
      setLoginData({
        email: "",
        password: "",
      });

      // Go to Home Page
      setPage("home");

      setMessage("");
      setError("");

    } catch (err) {
      console.error("Login error:", err);

      setError(
        err.message || "Login failed. Please check your details."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     REGISTER
  ===================================================== */

  const handleRegister = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    const nameRegex = /^[A-Za-z ]+$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    const name = registerData.name.trim();
    const email = registerData.email.trim();
    const password = registerData.password;
    const confirmPassword = registerData.confirmPassword;

    /* ---------- NAME VALIDATION ---------- */

    if (!name) {
      setError("Please enter your name.");
      return;
    }

    if (!nameRegex.test(name)) {
      setError("Name can contain only letters and spaces.");
      return;
    }

    if (name.length > 50) {
      setError("Name must be less than 50 characters.");
      return;
    }

    /* ---------- EMAIL VALIDATION ---------- */

    if (!email) {
      setError("Please enter your email.");
      return;
    }

    if (email.length > 100) {
      setError("Email must be less than 100 characters.");
      return;
    }

    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    /* ---------- PASSWORD VALIDATION ---------- */

    if (password.length !== 8) {
      setError("Password must be exactly 8 characters long.");
      return;
    }

    if (!/[A-Z]/.test(password)) {
      setError("Password must contain at least one uppercase letter.");
      return;
    }

    if (!/[a-z]/.test(password)) {
      setError("Password must contain at least one lowercase letter.");
      return;
    }

    if (!/[0-9]/.test(password)) {
      setError("Password must contain at least one number.");
      return;
    }

    if (!/[^A-Za-z0-9]/.test(password)) {
      setError("Password must contain at least one special character.");
      return;
    }

    /* ---------- CONFIRM PASSWORD ---------- */

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    /* ---------- API CALL ---------- */

    try {
      setLoading(true);

      const response = await fetch(`${AUTH_API}/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: name,
          email: email,
          password: password,
          role: registerData.role,
        }),
      });

      if (!response.ok) {
        let errorText = "Registration failed.";

        try {
          const data = await response.text();

          if (data) {
            errorText = data;
          }
        } catch {
          // Keep default error
        }

        throw new Error(errorText);
      }

      await response.json();

      /* ---------- CLEAR REGISTER FORM ---------- */

      setRegisterData({
        name: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "STUDENT",
      });

      /* ---------- GO TO LOGIN ---------- */

      setPage("login");

      setMessage(
        "Registration successful! Please login to continue."
      );

      setError("");

    } catch (err) {
      console.error("Registration error:", err);

      setError(
        err.message || "Registration failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     SEARCH PG
  ===================================================== */

  const handleSearch = async (e) => {
    e.preventDefault();

    setError("");
    setMessage("");

    try {
      setLoading(true);

      const params = new URLSearchParams();

      if (searchData.city.trim()) {
        params.append(
          "city",
          searchData.city.trim()
        );
      }

      if (searchData.minRent) {
        params.append(
          "minRent",
          searchData.minRent
        );
      }

      if (searchData.maxRent) {
        params.append(
          "maxRent",
          searchData.maxRent
        );
      }

      if (searchData.gender) {
        params.append(
          "gender",
          searchData.gender
        );
      }

      if (searchData.minRooms) {
        params.append(
          "minRooms",
          searchData.minRooms
        );
      }

      const url =
        params.toString().length > 0
          ? `${PG_API}/search?${params.toString()}`
          : PG_API;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Unable to search PGs.");
      }

      const data = await response.json();

      setPgs(Array.isArray(data) ? data : []);

      if (!data || data.length === 0) {
        setMessage(
          "No PGs found for your selected filters."
        );
      }

      setTimeout(() => {
        document
          .getElementById("pg-list")
          ?.scrollIntoView({
            behavior: "smooth",
          });
      }, 100);

    } catch (err) {
      console.error("Search error:", err);

      setError(
        err.message || "Unable to search PGs."
      );
    } finally {
      setLoading(false);
    }
  };

  /* =====================================================
     LOGOUT
  ===================================================== */

  const handleLogout = () => {
    setLoggedInUser(null);

    setLoginData({
      email: "",
      password: "",
    });

    setSearchData({
      city: "",
      minRent: "",
      maxRent: "",
      gender: "",
      minRooms: "",
    });

    setError("");
    setMessage("");

    // Stay on Home Page after logout
    setPage("home");
  };

  /* =====================================================
     AUTH PAGE
  ===================================================== */

  const renderAuthPage = () => {
    return (
      <div className="auth-page">

        <div className="auth-container">

          {/* ================= LEFT BRAND ================= */}

          <div className="auth-brand">

            <div className="brand-content">

              <img
                src="/campusnest.png"
                alt="CampusNest"
                className="auth-logo"
              />

              <h1>
                Find Your
                <span> Perfect Nest.</span>
              </h1>

              <p>
                Discover comfortable and affordable PGs and
                hostels near your college, university and workplace.
              </p>

              <div className="brand-features">

                <div>
                  <span>✓</span>
                  Verified PG Listings
                </div>

                <div>
                  <span>✓</span>
                  Easy Search
                </div>

                <div>
                  <span>✓</span>
                  Student Friendly
                </div>

              </div>

            </div>

            <div className="brand-decoration"></div>

          </div>


          {/* ================= RIGHT FORM ================= */}

          <div className="auth-form-section">

            <div className="auth-form-container">

              <div className="form-heading">

                <p className="small-heading">
                  {page === "login"
                    ? "WELCOME BACK"
                    : "JOIN CAMPUSNEST"}
                </p>

                <h2>
                  {page === "login"
                    ? "Sign in to your account"
                    : "Create your account"}
                </h2>

                <p>
                  {page === "login"
                    ? "Find a place that feels like home."
                    : "Start finding your perfect stay today."}
                </p>

              </div>


              {/* ================= MESSAGE ================= */}

              {message && (
                <div className="success-message">
                  {message}
                </div>
              )}

              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}


              {/* =================================================
                  LOGIN FORM
              ================================================= */}

              {page === "login" ? (

                <form onSubmit={handleLogin}>

                  <div className="input-box">

                    <label>
                      Email Address
                    </label>

                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          email: e.target.value,
                        })
                      }
                    />

                  </div>


                  <div className="input-box">

                    <label>
                      Password
                    </label>

                    <input
                      type="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({
                          ...loginData,
                          password: e.target.value,
                        })
                      }
                    />

                  </div>


                  <button
                    type="submit"
                    className="primary-btn"
                    disabled={loading}
                  >
                    {loading
                      ? "Signing In..."
                      : "Sign In"}
                  </button>


                  <div className="switch-form">

                    Don't have an account?

                    <button
                      type="button"
                      onClick={openRegister}
                    >
                      Create Account
                    </button>

                  </div>

                </form>

              ) : (

                /* =================================================
                   REGISTER FORM
                ================================================= */

                <form onSubmit={handleRegister}>

                  <div className="input-box">

                    <label>
                      Full Name
                    </label>

                    <input
                      type="text"
                      placeholder="Enter your full name"
                      value={registerData.name}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          name: e.target.value,
                        })
                      }
                    />

                  </div>


                  <div className="input-box">

                    <label>
                      Email Address
                    </label>

                    <input
                      type="email"
                      placeholder="Enter your email"
                      value={registerData.email}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          email: e.target.value,
                        })
                      }
                    />

                  </div>


                  <div className="input-box">

                    <label>
                      Password
                    </label>

                    <input
                      type="password"
                      placeholder="Create a password"
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          password: e.target.value,
                        })
                      }
                    />

                  </div>


                  <div className="input-box">

                    <label>
                      Confirm Password
                    </label>

                    <input
                      type="password"
                      placeholder="Confirm your password"
                      value={registerData.confirmPassword}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          confirmPassword: e.target.value,
                        })
                      }
                    />

                  </div>


                  <div className="password-rules">

                    <p>
                      Password must contain:
                    </p>

                    <span>
                      8+ characters
                    </span>

                    <span>
                      Uppercase
                    </span>

                    <span>
                      Lowercase
                    </span>

                    <span>
                      Number
                    </span>

                    <span>
                      Special character
                    </span>

                  </div>


                  <div className="input-box">

                    <label>
                      Account Type
                    </label>

                    <select
                      value={registerData.role}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          role: e.target.value,
                        })
                      }
                    >

                      <option value="STUDENT">
                        Student
                      </option>

                      <option value="OWNER">
                        PG Owner
                      </option>

                    </select>

                  </div>


                  <button
                    type="submit"
                    className="primary-btn"
                    disabled={loading}
                  >
                    {loading
                      ? "Creating Account..."
                      : "Create Account"}
                  </button>


                  <div className="switch-form">

                    Already have an account?

                    <button
                      type="button"
                      onClick={openLogin}
                    >
                      Sign In
                    </button>

                  </div>

                </form>

              )}

            </div>

          </div>

        </div>

      </div>
    );
  };


  /* =====================================================
     HOME PAGE
  ===================================================== */

  const renderHomePage = () => {
    return (
      <div className="home-page">

        {/* =================================================
            HEADER
        ================================================= */}

        <header className="home-header">

          {/* LOGO */}

          <div className="nav-logo">

            <img
              src="/campusnest.png"
              alt="CampusNest"
            />

          </div>


          {/* NAVIGATION */}

          <nav>

            <a href="#home">
              Home
            </a>

            <a href="#find-pg">
              Find PG
            </a>

            <a href="#features">
              Features
            </a>

            <a href="#pg-list">
              PGs
            </a>

          </nav>


          {/* USER AREA */}

          <div className="nav-user">

            {loggedInUser ? (

              <>
                <div className="welcome-text">

                  <span>
                    Welcome,
                  </span>

                  <strong>
                    {loggedInUser.name || "User"}
                  </strong>

                </div>

                <button
                  className="logout-btn"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>

            ) : (

              <>
                <button
                  className="nav-login-btn"
                  onClick={openLogin}
                >
                  Login
                </button>

                <button
                  className="nav-register-btn"
                  onClick={openRegister}
                >
                  Register
                </button>
              </>

            )}

          </div>

        </header>


        {/* =================================================
            HERO
        ================================================= */}

        <section
          className="home-hero"
          id="home"
        >

          <div className="hero-content">

            <p className="hero-small">
              YOUR HOME AWAY FROM HOME
            </p>

            <h1>
              Find a place
              <br />
              that feels like
              <span> home.</span>
            </h1>

            <p className="hero-description">
              Discover verified PGs and hostels near your
              college, university or workplace.
            </p>

            <a
              href="#find-pg"
              className="hero-btn"
            >
              Find Your PG
            </a>

          </div>


          {/* PG ROOM IMAGE */}

          <div className="hero-photo">

            <img
              src="/pg-room.png"
              alt="Student PG room"
            />

          </div>

        </section>


        {/* =================================================
            FEATURES
        ================================================= */}

        <section
          className="feature-strip"
          id="features"
        >

          <div className="feature-card">

            <div className="feature-icon">
              ⌂
            </div>

            <div>

              <h3>
                Find PGs
              </h3>

              <p>
                Search PGs based on city, rent,
                gender and available rooms.
              </p>

            </div>

            <span className="feature-arrow">
              →
            </span>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              ⌖
            </div>

            <div>

              <h3>
                Nearby Hostels
              </h3>

              <p>
                Find hostels and PGs located
                close to your preferred location.
              </p>

            </div>

            <span className="feature-arrow">
              →
            </span>

          </div>


          <div className="feature-card">

            <div className="feature-icon">
              🎓
            </div>

            <div>

              <h3>
                Near My College
              </h3>

              <p>
                Easily find accommodation near
                your college or institution.
              </p>

            </div>

            <span className="feature-arrow">
              →
            </span>

          </div>

        </section>


        {/* =================================================
            SEARCH SECTION
        ================================================= */}

        <section
          className="search-section"
          id="find-pg"
        >

          <div className="search-heading">

            <p>
              EXPLORE
            </p>

            <h2>
              Find Your Perfect Stay
            </h2>

          </div>


          <form
            className="search-box"
            onSubmit={handleSearch}
          >

            <div className="search-field">

              <label>
                City
              </label>

              <input
                type="text"
                placeholder="e.g. Ahmedabad"
                value={searchData.city}
                onChange={(e) =>
                  setSearchData({
                    ...searchData,
                    city: e.target.value,
                  })
                }
              />

            </div>


            <div className="search-field">

              <label>
                Min Rent
              </label>

              <input
                type="number"
                placeholder="₹ Min"
                value={searchData.minRent}
                onChange={(e) =>
                  setSearchData({
                    ...searchData,
                    minRent: e.target.value,
                  })
                }
              />

            </div>


            <div className="search-field">

              <label>
                Max Rent
              </label>

              <input
                type="number"
                placeholder="₹ Max"
                value={searchData.maxRent}
                onChange={(e) =>
                  setSearchData({
                    ...searchData,
                    maxRent: e.target.value,
                  })
                }
              />

            </div>


            <div className="search-field">

              <label>
                Gender
              </label>

              <select
                value={searchData.gender}
                onChange={(e) =>
                  setSearchData({
                    ...searchData,
                    gender: e.target.value,
                  })
                }
              >

                <option value="">
                  Any
                </option>

                <option value="MALE">
                  Male
                </option>

                <option value="FEMALE">
                  Female
                </option>

              </select>

            </div>


            <div className="search-field">

              <label>
                Min Rooms
              </label>

              <input
                type="number"
                placeholder="Rooms"
                value={searchData.minRooms}
                onChange={(e) =>
                  setSearchData({
                    ...searchData,
                    minRooms: e.target.value,
                  })
                }
              />

            </div>


            <button
              type="submit"
              className="search-btn"
              disabled={loading}
            >
              {loading ? "..." : "Search"}
            </button>

          </form>

        </section>


        {/* =================================================
            MESSAGES
        ================================================= */}

        {(message || error) && (

          <div className="home-message-area">

            {message && (
              <div className="success-message">
                {message}
              </div>
            )}

            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

          </div>

        )}


        {/* =================================================
            PG LIST
        ================================================= */}

        <section
          className="pg-section"
          id="pg-list"
        >

          <div className="pg-heading">

            <p>
              RECOMMENDED FOR YOU
            </p>

            <h2>
              Available PGs
            </h2>

          </div>


          {pgs.length === 0 ? (

            <div className="empty-pgs">

              <div className="empty-icon">
                ⌂
              </div>

              <h3>
                No PGs available
              </h3>

              <p>
                Try searching with different filters.
              </p>

            </div>

          ) : (

            <div className="pg-grid">

              {pgs.map((pg) => (

                <div
                  className="pg-card"
                  key={pg.id}
                >

                  <div className="pg-image">

                    <img
                      src="/pg-room.png"
                      alt="Student PG room"
                    />

                    <span className="pg-tag">
                      {pg.gender || "PG"}
                    </span>

                  </div>


                  <div className="pg-card-content">

                    <h3>
                      {pg.name || "CampusNest PG"}
                    </h3>

                    <p className="pg-location">
                      📍 {pg.city || "Location unavailable"}
                    </p>


                    <div className="pg-details">

                      <div>

                        <span>
                          Monthly Rent
                        </span>

                        <strong>
                          ₹{pg.rent ?? "N/A"}
                        </strong>

                      </div>


                      <div>

                        <span>
                          Available Rooms
                        </span>

                        <strong>
                          {pg.availableRooms ?? "N/A"}
                        </strong>

                      </div>

                    </div>


                    <button
                      className="view-btn"
                      onClick={() => {
                        alert(
                          `PG: ${pg.name || "CampusNest PG"}\n` +
                          `City: ${pg.city || "N/A"}\n` +
                          `Rent: ₹${pg.rent ?? "N/A"}`
                        );
                      }}
                    >
                      View Details
                      <span>→</span>
                    </button>

                  </div>

                </div>

              ))}

            </div>

          )}

        </section>


        {/* =================================================
            WHY CAMPUSNEST
        ================================================= */}

        <section className="why-section">

          <div className="why-content">

            <p className="section-label">
              WHY CAMPUSNEST
            </p>

            <h2>
              Your search for a
              <span> perfect stay </span>
              ends here.
            </h2>

            <p className="why-description">
              CampusNest makes it easier for students
              and working professionals to discover
              comfortable, affordable and convenient
              accommodation.
            </p>


            <div className="why-points">

              <div>

                <span>
                  01
                </span>

                <p>
                  Easy and fast PG search
                </p>

              </div>


              <div>

                <span>
                  02
                </span>

                <p>
                  Multiple filtering options
                </p>

              </div>


              <div>

                <span>
                  03
                </span>

                <p>
                  Location-based accommodation
                </p>

              </div>

            </div>

          </div>

        </section>


        {/* =================================================
            FOOTER
        ================================================= */}

        <footer className="home-footer">

          <div className="footer-brand">

            <img
              src="/campusnest.png"
              alt="CampusNest"
            />

            <p>
              Find your home away from home.
            </p>

          </div>


          <div className="footer-right">
            © 2026 CampusNest. All rights reserved.
          </div>

        </footer>

      </div>
    );
  };


  /* =====================================================
     MAIN PAGE SWITCH
  ===================================================== */

  if (page === "login" || page === "register") {
    return renderAuthPage();
  }

  return renderHomePage();
}

export default App;