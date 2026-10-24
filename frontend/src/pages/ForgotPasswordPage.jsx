import { useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { forgotPassword } from "../api/client";
import { LOGIN_SIDE_IMAGE } from "../constants/images";
import { MailIcon } from "../components/icons";

function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your email.");
      return;
    }

    try {
      setLoading(true);
      await forgotPassword(email.trim());
      setSubmitted(true);
    } catch (err) {
      setError(err.message || "Unable to send reset email. Please try again.");
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
      <h2>Forgot Password</h2>
      <p className="section-sub">
        Enter your account email and we'll send you a link to reset your password.
      </p>

      {submitted ? (
        <div className="alert alert-success">
          If that email is registered, a reset link has been sent. Please check your inbox
          (and spam folder).
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          {error && <div className="alert alert-error">{error}</div>}

          <div className="field">
            <label>Email Address</label>
            <div className="input-with-icon">
              <MailIcon />
              <input
                type="email"
                placeholder="Enter your email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? "Sending…" : "Send Reset Link"}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}

export default ForgotPasswordPage;
