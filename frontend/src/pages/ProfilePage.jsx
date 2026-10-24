import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { useAuth } from "../context/useAuth";
import { changePassword, updateProfile } from "../api/client";
import {
  BriefcaseIcon,
  EyeIcon,
  EyeOffIcon,
  GraduationCapIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from "../components/icons";

const NAME_REGEX = /^[A-Za-z ]+$/;
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

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

function ProfilePage() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) {
      navigate("/login");
    }
  }, [user, navigate]);

  // --------------------------------------------------
  // PROFILE DETAILS FORM
  // --------------------------------------------------
  const [profileForm, setProfileForm] = useState({
    name: user?.name || "",
    email: user?.email || "",
  });
  const [profileError, setProfileError] = useState("");
  const [profileSuccess, setProfileSuccess] = useState("");
  const [profileLoading, setProfileLoading] = useState(false);

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setProfileError("");
    setProfileSuccess("");

    const name = profileForm.name.trim();
    const email = profileForm.email.trim();

    if (!name) {
      setProfileError("Please enter your name.");
      return;
    }
    if (!NAME_REGEX.test(name)) {
      setProfileError("Name can contain only letters and spaces.");
      return;
    }
    if (!email || !EMAIL_REGEX.test(email)) {
      setProfileError("Please enter a valid email address.");
      return;
    }

    try {
      setProfileLoading(true);
      const updated = await updateProfile(user.id, { name, email });
      updateUser({ name: updated.name, email: updated.email });
      setProfileSuccess("Profile updated successfully.");
    } catch (err) {
      setProfileError(err.message || "Unable to update profile.");
    } finally {
      setProfileLoading(false);
    }
  };

  // --------------------------------------------------
  // CHANGE PASSWORD FORM
  // --------------------------------------------------
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [passwordError, setPasswordError] = useState("");
  const [passwordSuccess, setPasswordSuccess] = useState("");
  const [passwordLoading, setPasswordLoading] = useState(false);

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordError("");
    setPasswordSuccess("");

    const { currentPassword, newPassword, confirmPassword } = passwordForm;

    if (!currentPassword) {
      setPasswordError("Please enter your current password.");
      return;
    }

    const complexityError = validatePassword(newPassword);
    if (complexityError) {
      setPasswordError(complexityError);
      return;
    }

    if (newPassword !== confirmPassword) {
      setPasswordError("New passwords do not match.");
      return;
    }

    try {
      setPasswordLoading(true);
      await changePassword(user.id, { currentPassword, newPassword });
      setPasswordSuccess("Password updated successfully.");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      setPasswordError(err.message || "Unable to change password.");
    } finally {
      setPasswordLoading(false);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="page">
      <Navbar />

      <section className="profile-page">
        <div className="profile-summary">
          <span className="profile-avatar">
            {(user.name || "U").charAt(0).toUpperCase()}
          </span>
          <div>
            <h1>{user.name}</h1>
            <p className="profile-role">
              {user.role === "OWNER" ? <BriefcaseIcon /> : <GraduationCapIcon />}
              {user.role === "OWNER" ? "PG Owner" : "Student"}
            </p>
          </div>
        </div>

        <div className="profile-grid">
          {/* ================= PROFILE DETAILS ================= */}
          <form className="profile-card" onSubmit={handleProfileSubmit}>
            <h2>Profile Details</h2>
            <p className="section-sub">Update your name and email address.</p>

            {profileError && <div className="alert alert-error">{profileError}</div>}
            {profileSuccess && <div className="alert alert-success">{profileSuccess}</div>}

            <div className="field">
              <label>Full Name</label>
              <div className="input-with-icon">
                <UserIcon />
                <input
                  type="text"
                  value={profileForm.name}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, name: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="field">
              <label>Email Address</label>
              <div className="input-with-icon">
                <MailIcon />
                <input
                  type="email"
                  value={profileForm.email}
                  onChange={(e) =>
                    setProfileForm({ ...profileForm, email: e.target.value })
                  }
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={profileLoading}>
              {profileLoading ? "Saving…" : "Save Changes"}
            </button>
          </form>

          {/* ================= CHANGE PASSWORD ================= */}
          <form className="profile-card" onSubmit={handlePasswordSubmit}>
            <h2>Change Password</h2>
            <p className="section-sub">
              Exactly 8 characters: uppercase, lowercase, number and special character.
            </p>

            {passwordError && <div className="alert alert-error">{passwordError}</div>}
            {passwordSuccess && <div className="alert alert-success">{passwordSuccess}</div>}

            <div className="field">
              <label>Current Password</label>
              <div className="input-with-icon">
                <LockIcon />
                <input
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={passwordForm.currentPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, currentPassword: e.target.value })
                  }
                />
              </div>
            </div>

            <div className="field">
              <label>New Password</label>
              <div className="input-with-icon">
                <LockIcon />
                <input
                  type={showPassword ? "text" : "password"}
                  maxLength={8}
                  autoComplete="new-password"
                  value={passwordForm.newPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, newPassword: e.target.value })
                  }
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

            <div className="field">
              <label>Confirm New Password</label>
              <div className="input-with-icon">
                <LockIcon />
                <input
                  type={showPassword ? "text" : "password"}
                  maxLength={8}
                  autoComplete="new-password"
                  value={passwordForm.confirmPassword}
                  onChange={(e) =>
                    setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })
                  }
                />
              </div>
            </div>

            <button type="submit" className="btn btn-primary" disabled={passwordLoading}>
              {passwordLoading ? "Updating…" : "Update Password"}
            </button>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default ProfilePage;
