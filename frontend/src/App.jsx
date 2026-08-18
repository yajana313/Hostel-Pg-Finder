import { useState } from "react";
import "./App.css";

const API_URL = "http://localhost:8081/api/auth";

function App() {
  const [mode, setMode] = useState("login");
  const [showPassword, setShowPassword] = useState(false);

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

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const switchMode = (newMode) => {
    setMode(newMode);
    setMessage("");
    setError("");
    setShowPassword(false);
  };

  const handleLoginChange = (e) => {
    setLoginData({
      ...loginData,
      [e.target.name]: e.target.value,
    });
  };

  const handleRegisterChange = (e) => {
    setRegisterData({
      ...registerData,
      [e.target.name]: e.target.value,
    });
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    setMessage("");
    setError("");

    if (!loginData.email || !loginData.password) {
      setError("Please enter your email and password.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      if (!response.ok) {
        throw new Error("Invalid email or password");
      }

      const user = await response.json();

      setMessage(`Welcome back, ${user.name}!`);

    } catch (err) {
      setError(err.message);
    }
  };
  const validateRegistration = () => {
  const name = registerData.name.trim();
  const email = registerData.email.trim();
  const password = registerData.password;
  const confirmPassword = registerData.confirmPassword;

  if (!name) {
    return "Full name is required.";
  }

  if (!/^[A-Za-z ]+$/.test(name)) {
    return "Full name can contain only letters and spaces.";
  }

  if (name.length > 50) {
    return "Full name must be maximum 50 characters.";
  }

  if (!email) {
    return "Email address is required.";
  }

  if (email.length > 100) {
    return "Email address must be maximum 100 characters.";
  }

  const emailPattern =
    /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

  if (!emailPattern.test(email)) {
    return "Please enter a valid email address.";
  }

  if (!password) {
    return "Password is required.";
  }

  if (password.length < 8) {
    return "Password must be at least 8 characters.";
  }

  if (password.length > 64) {
    return "Password must be maximum 64 characters.";
  }

  if (!/[A-Z]/.test(password)) {
    return "Password must contain at least one uppercase letter.";
  }

  if (!/[a-z]/.test(password)) {
    return "Password must contain at least one lowercase letter.";
  }

  if (!/[0-9]/.test(password)) {
    return "Password must contain at least one number.";
  }

  if (!/[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=;'`~]/.test(password)) {
    return "Password must contain at least one special character.";
  }

  if (!confirmPassword) {
    return "Please confirm your password.";
  }

  if (password !== confirmPassword) {
    return "Passwords do not match.";
  }

  return null;
};

const handleRegister = async (e) => {
  e.preventDefault();

  setMessage("");
  setError("");

  const validationError = validateRegistration();

  if (validationError) {
    setError(validationError);
    return;
  }

  try {
    const response = await fetch(`${API_URL}/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: registerData.name.trim(),
        email: registerData.email.trim().toLowerCase(),
        password: registerData.password,
        role: registerData.role,
      }),
    });

    if (response.status === 409) {
      setError("This email is already registered.");
      return;
    }

    if (!response.ok) {
      setError("Unable to create account. Please try again.");
      return;
    }

    await response.json();

    setMessage("Account created successfully! Redirecting to login...");

    setRegisterData({
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
      role: "STUDENT",
    });

    setTimeout(() => {
      switchMode("login");
    }, 1500);

  } catch (err) {
    setError(
      "Unable to connect to server. Please make sure the backend is running."
    );
  }
};

  return (
    <main className="auth-page">

      {/* BACKGROUND DECORATION */}
      <div className="bg-circle circle-one"></div>
      <div className="bg-circle circle-two"></div>

      <div className="auth-card">

        {/* LEFT BRAND PANEL */}
        <section className="brand-panel">

          <div className="image-overlay"></div>

          <div className="brand-content">

            <div className="brand-top">
              <div className="brand-mark">
                  <img src="/campusnest.png" alt="CampusNest Logo" />
              </div>
              <span className="brand-name">
                Campus<span>Nest</span>
              </span>
            </div>

            <div className="brand-middle">

              <div className="eyebrow">
                YOUR STAY, YOUR WAY
              </div>

              <h1>
                Find a place
                <br />
                you'll love
                <br />
                to <span>call home.</span>
              </h1>

              <p>
                Discover verified PGs and hotels near your
                campus. Comfortable stays, trusted spaces,
                and easy booking — all in one place.
              </p>

            </div>

            <div className="brand-bottom">

              <div className="feature">
                <div className="feature-icon">✓</div>
                <div>
                  <strong>Verified</strong>
                  <small>Trusted properties</small>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">⌂</div>
                <div>
                  <strong>Student Friendly</strong>
                  <small>Made for campus life</small>
                </div>
              </div>

              <div className="feature">
                <div className="feature-icon">★</div>
                <div>
                  <strong>Easy Booking</strong>
                  <small>Simple & secure</small>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* FORM PANEL */}
        <section className="form-panel">

          <div className="form-container">

            <div className="mobile-logo">
              <div className="brand-mark">CN</div>
              <span>
                Campus<span>Nest</span>
              </span>
            </div>

            {/* SWITCH */}
            <div className="auth-switch">

              <button
                className={mode === "login" ? "active" : ""}
                onClick={() => switchMode("login")}
              >
                Login
              </button>

              <button
                className={mode === "register" ? "active" : ""}
                onClick={() => switchMode("register")}
              >
                Create account
              </button>

            </div>

            <div className="form-heading">

              <div className="small-label">
                {mode === "login"
                  ? "WELCOME BACK"
                  : "JOIN CAMPUSNEST"}
              </div>

              <h2>
                {mode === "login"
                  ? "Good to see you again."
                  : "Create your account."}
              </h2>

              <p>
                {mode === "login"
                  ? "Enter your details to continue."
                  : "Start finding your perfect stay today."}
              </p>

            </div>

            {message && (
              <div className="message success">
                <span>✓</span>
                {message}
              </div>
            )}

            {error && (
              <div className="message error">
                <span>!</span>
                {error}
              </div>
            )}

            {mode === "login" ? (

              <form onSubmit={handleLogin}>

                <div className="field">

                  <label>Email address</label>

                  <div className="input-box">

                    <span className="input-icon">@</span>

                    <input
                      type="email"
                      name="email"
                      placeholder="you@example.com"
                      value={loginData.email}
                      onChange={handleLoginChange}
                    />

                  </div>

                </div>

                <div className="field">

                  <div className="label-row">
                    <label>Password</label>
                    <button type="button">
                      Forgot password?
                    </button>
                  </div>

                  <div className="input-box">

                    <span className="input-icon">⌑</span>

                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Enter your password"
                      value={loginData.password}
                      onChange={handleLoginChange}
                    />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>

                  </div>

                </div>

                <button className="primary-btn" type="submit">
                  <span>Login to CampusNest</span>
                  <span>→</span>
                </button>

              </form>

            ) : (

              <form onSubmit={handleRegister}>

                <div className="field">

                  <label>Full name</label>

                  <div className="input-box">

                    <span className="input-icon">◎</span>

                    <input
                        type="text"
                        name="name"
                        placeholder="Your full name"
                        value={registerData.name}
                        onChange={handleRegisterChange}
                        maxLength={50}
                    />

                  </div>

                </div>

                <div className="field">

                  <label>Email address</label>

                  <div className="input-box">

                    <span className="input-icon">@</span>

                    <input
                        type="email"
                        name="email"
                        placeholder="you@example.com"
                        value={registerData.email}
                        onChange={handleRegisterChange}
                        maxLength={100}
                    />

                  </div>

                </div>

                <div className="field">

                  <label>Password</label>

                  <div className="input-box">

                    <span className="input-icon">⌑</span>

                    <input
                        type={showPassword ? "text" : "password"}
                        name="password"
                        placeholder="Minimum 8 characters"
                        value={registerData.password}
                        onChange={handleRegisterChange}
                        minLength={8}
                        maxLength={64}
                      />

                    <button
                      type="button"
                      className="password-toggle"
                      onClick={() =>
                        setShowPassword(!showPassword)
                      }
                    >
                      {showPassword ? "Hide" : "Show"}
                    </button>

                  </div>

                </div>

                <div className="field">

                  <label>Confirm password</label>

                  <div className="input-box">

                    <span className="input-icon">⌑</span>

                    <input
                      type="password"
                      name="confirmPassword"
                      placeholder="Repeat your password"
                      value={registerData.confirmPassword}
                      onChange={handleRegisterChange}
                      maxLength={64}
                    />

                    <div className="password-rules">

                  <span className={registerData.password.length >= 8 ? "valid" : ""}>
                    {registerData.password.length >= 8 ? "✓" : "○"}
                    At least 8 characters
                  </span>

                  <span className={/[A-Z]/.test(registerData.password) ? "valid" : ""}>
                    {/[A-Z]/.test(registerData.password) ? "✓" : "○"}
                    One uppercase letter
                  </span>

                  <span className={/[a-z]/.test(registerData.password) ? "valid" : ""}>
                    {/[a-z]/.test(registerData.password) ? "✓" : "○"}
                    One lowercase letter
                  </span>

                  <span className={/[0-9]/.test(registerData.password) ? "valid" : ""}>
                    {/[0-9]/.test(registerData.password) ? "✓" : "○"}
                    One number
                  </span>

                  <span
                    className={
                      /[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=;'`~]/.test(
                        registerData.password
                      )
                        ? "valid"
                        : ""
                    }
                  >
                    {
                      /[!@#$%^&*(),.?":{}|<>_\-\\[\]/+=;'`~]/.test(
                        registerData.password
                      )
                        ? "✓"
                        : "○"
                    }
                    One special character
                  </span>

                </div>

                </div>

                </div>

                <div className="field">

                  <label>I am a</label>

                  <div className="role-options">

                    <label
                      className={
                        registerData.role === "STUDENT"
                          ? "role active"
                          : "role"
                      }
                    >
                      <input
                        type="radio"
                        name="role"
                        value="STUDENT"
                        checked={registerData.role === "STUDENT"}
                        onChange={handleRegisterChange}
                      />

                      <span className="role-icon">🎓</span>

                      <span>
                        <strong>Student</strong>
                        <small>Looking for a stay</small>
                      </span>
                    </label>

                    <label
                      className={
                        registerData.role === "OWNER"
                          ? "role active"
                          : "role"
                      }
                    >
                      <input
                        type="radio"
                        name="role"
                        value="OWNER"
                        checked={registerData.role === "OWNER"}
                        onChange={handleRegisterChange}
                      />

                      <span className="role-icon">🏠</span>

                      <span>
                        <strong>Owner</strong>
                        <small>List your property</small>
                      </span>
                    </label>

                  </div>

                </div>

                <button className="primary-btn" type="submit">
                  <span>Create my account</span>
                  <span>→</span>
                </button>

              </form>
            )}

            <p className="bottom-text">

              {mode === "login"
                ? "New to CampusNest?"
                : "Already have an account?"}

              <button
                onClick={() =>
                  switchMode(
                    mode === "login"
                      ? "register"
                      : "login"
                  )
              }
              >
                {mode === "login"
                  ? " Create an account"
                  : " Login"}
              </button>

            </p>

            <div className="secure-note">
              <span>⌁</span>
              Your information is protected and secure
            </div>

          </div>

        </section>

      </div>

    </main>
  );
}

export default App;