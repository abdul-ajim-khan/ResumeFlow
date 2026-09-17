import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEnvelope, FaLock, FaSpinner } from "react-icons/fa";
import { authAPI } from "../services/api";
import AuthContext from "../context/AuthContext";

export default function Login() {
  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  // Validate a single field dynamically
  const validateField = (name, value) => {
    let error = "";
    if (name === "email") {
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
    }
    return error;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
    setServerError("");

    if (touched[name]) {
      setErrors({ ...errors, [name]: validateField(name, value) });
    }
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });
    setErrors({ ...errors, [name]: validateField(name, value) });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const emailError = validateField("email", form.email);
    const passwordError = validateField("password", form.password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      setTouched({ email: true, password: true });
      return;
    }

    setLoading(true);
    setServerError("");

    try {
      const res = await authAPI.login(form);
      login(res.data.token, res.data.user);
      navigate("/dashboard");
    } catch (err) {
      setServerError(err.response?.data?.message || "Login failed. Please check your credentials.");
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
            <h1>Login</h1>
          </div>

          {serverError && <div className="auth-error">{serverError}</div>}

          <form onSubmit={handleSubmit} noValidate>
            {/* Email Field */}
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

            {/* Password Field */}
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <div className={`input-wrapper ${touched.password && errors.password ? "input-error" : ""}`}>
                <FaLock className="input-icon" />
                <input
                  id="password"
                  name="password"
                  type="password"
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  onBlur={handleBlur}
                />
              </div>
              {touched.password && errors.password && (
                <span className="field-error-text">{errors.password}</span>
              )}
            </div>

            <button type="submit" className="auth-btn" disabled={loading}>
              {loading ? <FaSpinner className="spin" /> : "Sign In"}
            </button>
          </form>

          <p className="auth-switch">
            Don&apos;t have an account? <Link to="/register">Sign Up</Link>
          </p>
        </div>
      </div>
    </div>
  );
}