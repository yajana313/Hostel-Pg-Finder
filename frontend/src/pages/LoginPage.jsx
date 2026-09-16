import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { login } from "../api/client";
import { useAuth } from "../context/useAuth";
import { LOGIN_SIDE_IMAGE } from "../constants/images";
import { EyeIcon, EyeOffIcon, GoogleIcon, LockIcon, MailIcon, PhoneIcon } from "../components/icons";

function LoginPage() {
  const { setUser } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [remember, setRemember] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [forgotNote, setForgotNote] = useState(false);

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
          <button type="button" className="link-btn" onClick={() => setForgotNote((v) => !v)}>
            Forgot password?
          </button>
        </div>

        {forgotNote && (
          <p className="field-hint forgot-note">
            Password reset isn't available yet — please contact your PG owner or admin for help.
          </p>
        )}

        <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
          {loading ? "Logging In…" : "Login"}
        </button>

        <div className="divider-with-text">
          <span>Or continue with</span>
        </div>

        <div className="social-login-row">
          <button type="button" className="btn btn-outline" disabled title="Coming soon">
            <GoogleIcon /> Continue with Google
          </button>
          <button type="button" className="btn btn-outline" disabled title="Coming soon">
            <PhoneIcon /> Continue with Phone
          </button>
        </div>

        <p className="switch-form">
          Don't have an account? <Link to="/register">Register</Link>
        </p>
      </form>
    </AuthLayout>
  );
}

export default LoginPage;
