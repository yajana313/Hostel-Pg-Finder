import { useState } from "react";

import {
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";

import AuthLayout from "../components/AuthLayout";

import { register } from "../api/client";

import {
  REGISTER_SIDE_IMAGE,
} from "../constants/images";

import {
  BriefcaseIcon,
  EyeIcon,
  EyeOffIcon,
  GraduationCapIcon,
  LockIcon,
  MailIcon,
  UserIcon,
} from "../components/icons";


const NAME_REGEX =
  /^[A-Za-z ]+$/;

const EMAIL_REGEX =
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/;


// ======================================================
// REGISTER PAGE
// ======================================================

function RegisterPage() {

  const navigate =
    useNavigate();

  const location =
    useLocation();


  // ====================================================
  // FORM
  // ====================================================

  const [form, setForm] = useState({

    name: "",

    email: "",

    password: "",

    confirmPassword: "",

    role:
      location.state?.role === "OWNER"
        ? "OWNER"
        : "STUDENT",

  });


  const [showPassword, setShowPassword] =
    useState(false);

  const [error, setError] =
    useState("");

  const [loading, setLoading] =
    useState(false);


  // ====================================================
  // UPDATE FORM
  // ====================================================

  const update = (
    field,
    value
  ) => {

    setForm((current) => ({
      ...current,
      [field]: value,
    }));

  };


  // ====================================================
  // VALIDATION
  // ====================================================

  const validate = () => {

    const name =
      form.name.trim();

    const email =
      form.email.trim();

    const {
      password,
      confirmPassword,
    } = form;


    if (!name) {
      return "Please enter your name.";
    }


    if (!NAME_REGEX.test(name)) {
      return "Name can contain only letters and spaces.";
    }


    if (name.length > 50) {
      return "Name must be less than 50 characters.";
    }


    if (!email) {
      return "Please enter your email.";
    }


    if (email.length > 100) {
      return "Email must be less than 100 characters.";
    }


    if (!EMAIL_REGEX.test(email)) {
      return "Please enter a valid email address.";
    }


    // EXACTLY 8 CHARACTERS

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


    if (
      password !==
      confirmPassword
    ) {
      return "Passwords do not match.";
    }


    return "";

  };


  // ====================================================
  // SUBMIT
  // ====================================================

  const handleSubmit = async (
    event
  ) => {

    event.preventDefault();

    setError("");


    const validationError =
      validate();


    if (validationError) {

      setError(
        validationError
      );

      return;

    }


    try {

      setLoading(true);


      await register({

        name:
          form.name.trim(),

        email:
          form.email.trim(),

        password:
          form.password,

        role:
          form.role,

      });


      navigate(
        "/login",
        {
          state: {
            registered: true,
          },
        }
      );


    } catch (err) {

      setError(
        err.message ||
        "Registration failed. Please try again."
      );

    } finally {

      setLoading(false);

    }

  };


  return (

    <AuthLayout

      contextText="Already have an account?"

      contextLinkText="Login"

      contextLinkTo="/login"

      image={REGISTER_SIDE_IMAGE}

      imageOverlay={
        form.role === "OWNER"
          ? "List Your PG on CampusNest"
          : "Find Your Perfect Stay"
      }

    >

      {/* =================================================
          TITLE
      ================================================= */}

      <h2>
        Create Your Account
      </h2>


      <p className="section-sub">

        Join CampusNest and find
        the right stay in Ahmedabad.

      </p>


      {/* =================================================
          ERROR
      ================================================= */}

      {error && (

        <div className="alert alert-error">

          {error}

        </div>

      )}


      {/* =================================================
          FORM
      ================================================= */}

      <form
        onSubmit={handleSubmit}
      >


        {/* NAME */}

        <div className="field">

          <label>
            Full Name
          </label>

          <div className="input-with-icon">

            <UserIcon />

            <input
              type="text"
              placeholder="Enter your name"
              value={form.name}

              onChange={(event) =>
                update(
                  "name",
                  event.target.value
                )
              }
            />

          </div>

        </div>


        {/* EMAIL */}

        <div className="field">

          <label>
            Email Address
          </label>

          <div className="input-with-icon">

            <MailIcon />

            <input
              type="email"
              placeholder="Enter your email"
              value={form.email}

              onChange={(event) =>
                update(
                  "email",
                  event.target.value
                )
              }
            />

          </div>

        </div>


        {/* PASSWORD */}

        <div className="field">

          <label>
            Password
          </label>

          <div className="input-with-icon">

            <LockIcon />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }

              maxLength={8}

              placeholder="Create an 8-character password"

              value={form.password}

              onChange={(event) =>
                update(
                  "password",
                  event.target.value
                )
              }

            />


            <button
              type="button"
              className="input-icon-toggle"

              onClick={() =>
                setShowPassword(
                  (value) =>
                    !value
                )
              }

              aria-label={
                showPassword
                  ? "Hide password"
                  : "Show password"
              }
            >

              {showPassword
                ? <EyeOffIcon />
                : <EyeIcon />}

            </button>

          </div>

          <p className="field-hint">

            Exactly 8 characters:
            uppercase, lowercase,
            number and special character.

          </p>

        </div>


        {/* CONFIRM PASSWORD */}

        <div className="field">

          <label>
            Confirm Password
          </label>

          <div className="input-with-icon">

            <LockIcon />

            <input
              type={
                showPassword
                  ? "text"
                  : "password"
              }

              maxLength={8}

              placeholder="Confirm your password"

              value={
                form.confirmPassword
              }

              onChange={(event) =>
                update(
                  "confirmPassword",
                  event.target.value
                )
              }

            />

          </div>

        </div>


        {/* =================================================
            ROLE
        ================================================= */}

        <div className="field">

          <label>
            Select Your Role
          </label>


          <div className="role-toggle">


            {/* STUDENT */}

            <button
              type="button"

              className={
                form.role ===
                "STUDENT"
                  ? "role-toggle-active"
                  : ""
              }

              onClick={() =>
                update(
                  "role",
                  "STUDENT"
                )
              }
            >

              <GraduationCapIcon />

              Student

            </button>


            {/* OWNER */}

            <button
              type="button"

              className={
                form.role ===
                "OWNER"
                  ? "role-toggle-active"
                  : ""
              }

              onClick={() =>
                update(
                  "role",
                  "OWNER"
                )
              }
            >

              <BriefcaseIcon />

              Owner

            </button>

          </div>

        </div>


        {/* REGISTER */}

        <button
          type="submit"
          className="btn btn-primary btn-block"
          disabled={loading}
        >

          {loading
            ? "Creating Account..."
            : "Create Account"}

        </button>


        {/* TERMS */}

        <p className="terms-note">

          By creating an account,
          you agree to our Terms &
          Conditions and Privacy Policy.

        </p>


        {/* LOGIN */}

        <p className="switch-form">

          Already have an account?

          {" "}

          <Link to="/login">
            Login
          </Link>

        </p>

      </form>

    </AuthLayout>

  );

}

export default RegisterPage;