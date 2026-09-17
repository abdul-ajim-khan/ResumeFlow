import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import { authAPI } from "../services/api";
import AuthContext from "../context/AuthContext";

export default function Register() {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const validateField = (name, value, currentForm = form) => {
    let error = "";
    if (name === "name") {
      if (!value.trim()) {
        error = "Full name is required.";
      }
    } else if (name === "email") {
      if (!value) {
        error = "Email address is required.";
      } else if (!/\S+@\S+\.\S+/.test(value)) {
        error = "Please enter a valid email address.";
      }
    } else if (name === "password") {
      if (!value) {
        error = "Password is required.";
      } else if (value.length < 6) {
        error = "Password must be at least 6 characters.";
      }
    } else if (name === "confirmPassword") {
      if (!value) {
        error = "Please confirm your password.";
      } else if (value !== currentForm.password) {
        error = "Passwords do not match.";
      }
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const updatedForm = { ...form, [name]: value };
    setForm(updatedForm);
    setServerError("");

    if (touched[name]) {
      setErrors({ ...errors, [name]: validateField(name, value, updatedForm) });
    }

    if (name === "password" && touched.confirmPassword) {
      setErrors((prev) => ({
        ...prev,
        confirmPassword: validateField("confirmPassword", form.confirmPassword, updatedForm),
      }));
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const nameError = validateField("name", form.name);
    const emailError = validateField("email", form.email);
    const passwordError = validateField("password", form.password);
    const confirmPasswordError = validateField("confirmPassword", form.confirmPassword);

    if (nameError || emailError || passwordError || confirmPasswordError) {
      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
        confirmPassword: confirmPasswordError,
      });
      setTouched({ name: true, email: true, password: true, confirmPassword: true });
      return;
    }

    setLoading(true);
    setServerError("");

    try {
      const res = await authAPI.register({
        name: form.name,
        email: form.email,
        password: form.password,
      });
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-blob auth-blob-1"></div>
      <div className="auth-blob auth-blob-2"></div>
      <div className="auth-container">
        <div className="auth-card">
          <div className="auth-logo">
            <h1>Create Your Account</h1>
          </div>

          {serverError && <div className="auth-error">{serverError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label htmlFor="name">Full Name</label>
              <div className={`input-wrapper ${touched.name && errors.name ? "input-error" : ""}`}>
                <FaUser className="input-icon" />
                <input
                  id="name"
                  name="name"
                  type="text"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {touched.name && errors.name && (
                <span className="field-error-text">{errors.name}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <div className={`input-wrapper ${touched.email && errors.email ? "input-error" : ""}`}>
                <FaEnvelope className="input-icon" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {touched.email && errors.email && (
                <span className="field-error-text">{errors.email}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className={`input-wrapper ${touched.password && errors.password ? "input-error" : ""}`}>
                <FaLock className="input-icon" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {touched.password && errors.password && (
                <span className="field-error-text">{errors.password}</span>
              )}
            </div>

            <div className="form-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className={`input-wrapper ${touched.confirmPassword && errors.confirmPassword ? "input-error" : ""}`}>
                <FaLock className="input-icon" />
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {touched.confirmPassword && errors.confirmPassword && (
                <span className="field-error-text">{errors.confirmPassword}</span>
              )}
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? <FaSpinner className="spin" /> : "Create Account"}
            </button>
          </form>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}