import { useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import AuthLayout from "../components/AuthLayout";
import { resetPassword } from "../api/client";
import { LOGIN_SIDE_IMAGE } from "../constants/images";
import { EyeIcon, EyeOffIcon, LockIcon } from "../components/icons";

function validatePassword(password) {
  if (password.length !== 8) {
    return "Password must be exactly 8 characters long.";
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
  if (!/[^A-Za-z0-9]/.test(password)) {
    return "Password must contain at least one special character.";
  }
  return "";
}

function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [form, setForm] = useState({ newPassword: "", confirmPassword: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const complexityError = validatePassword(form.newPassword);
    if (complexityError) {
      setError(complexityError);
      return;
    }

    if (form.newPassword !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      await resetPassword(token, form.newPassword);
      navigate("/login", { state: { passwordReset: true } });
    } catch (err) {
      setError(err.message || "Unable to reset password. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout
      contextText="Remembered your password?"
      contextLinkText="Login"
      contextLinkTo="/login"
      image={LOGIN_SIDE_IMAGE}
      imageOverlay="Your Next Chapter Starts Here"
    >
      <h2>Reset Password</h2>
      <p className="section-sub">Choose a new password for your account.</p>

      {!token ? (
        <div className="alert alert-error">
          This reset link is invalid or missing. Please request a new one from the
          Forgot Password page.
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="field">
            <label>New Password</label>
            <div className="input-with-icon">
              <LockIcon />
              <input
                type={showPassword ? "text" : "password"}
                maxLength={8}
                autoComplete="new-password"
                placeholder="Create an 8-character password"
                value={form.newPassword}
                onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
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
            <p className="field-hint">
              Exactly 8 characters: uppercase, lowercase, number and special character.
            </p>
          </div>

          <div className="field">
            <label>Confirm New Password</label>
            <div className="input-with-icon">
              <LockIcon />
              <input
                type={showPassword ? "text" : "password"}
                maxLength={8}
                autoComplete="new-password"
                placeholder="Confirm your password"
                value={form.confirmPassword}
                onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Resetting…" : "Reset Password"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}

export default ResetPasswordPage;
