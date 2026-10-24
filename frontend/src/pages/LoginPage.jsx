import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { login } from "../api/client";
import { useAuth } from "../context/useAuth";
import { LOGIN_SIDE_IMAGE } from "../constants/images";
import { EyeIcon, EyeOffIcon, LockIcon, MailIcon } from "../components/icons";

function LoginPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email.trim()) {
      setError("Please enter your email.");
      return;
    }
    if (!form.password) {
      setError("Please enter your password.");
      return;
    }

    try {
      setLoading(true);
      const user = await login({ email: form.email.trim(), password: form.password });
      setUser(user, remember);
      navigate("/");
    } catch (err) {
      setError(err.message || "Login failed. Please check your details.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      contextText="New here?"
      contextLinkText="Register"
      contextLinkTo="/register"
      image={LOGIN_SIDE_IMAGE}
      imageOverlay="Your Next Chapter Starts Here"
    >
      <h2>Login to Your Account</h2>
      <p className="section-sub">Welcome back! Please login to continue.</p>

      {location.state?.registered && !error && (
        <div className="alert alert-success">Registration successful! Please login to continue.</div>
      )}
      {location.state?.passwordReset && !error && (
        <div className="alert alert-success">Password reset successful! Please login with your new password.</div>
      )}
      {location.state?.requireAuth && !error && (
        <div className="alert alert-error">Please login or register to search for PGs/hostels.</div>
      )}
      {error && <div className="alert alert-error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <div className="field">
          <label>Email Address</label>
          <div className="input-with-icon">
            <MailIcon />
            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
          </div>
        </div>

        <div className="field">
          <label>Password</label>
          <div className="input-with-icon">
            <LockIcon />
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Enter your password"
              autoComplete="current-password"
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="button"
              className="input-icon-toggle"
              onClick={() => setShowPassword((v) => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOffIcon /> : <EyeIcon />}
            </button>
          </div>
        </div>

        <div className="form-row-between">
          <label className="checkbox-label">
            <input type="checkbox" checked={remember} onChange={(e) => setRemember(e.target.checked)} />
            Remember me
          </label>
          <Link to="/forgot-password" className="link-btn">
            Forgot password?
          </Link>
        </div>

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Logging In…" : "Login"}
        </button>

        <p className="switch-form">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
