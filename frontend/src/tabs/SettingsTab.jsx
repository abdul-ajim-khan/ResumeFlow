import { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { FaUser, FaEnvelope, FaSave, FaSpinner, FaCheckCircle, FaSignOutAlt } from "react-icons/fa";
import { userAPI } from "../services/api";
import AuthContext from "../context/AuthContext";

export default function SettingsTab() {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "" });
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  useEffect(() => {
    if (user) {
      setForm({ name: user.name || "", email: user.email || "" });
    }
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setSaved(false);
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSaved(false);
    try {
      const res = await userAPI.updateProfile(form);
      const updatedUser = { ...user, ...res.data.user };
      login(localStorage.getItem("token"), updatedUser);
      setSaved(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="settings-tab">
      <h2 className="tab-heading">Account Settings</h2>
      <p className="tab-subheading">Manage your personal information and account details.</p>

      <div className="settings-card">
        <div className="settings-profile">
          <div className="settings-avatar">{form.name?.charAt(0)?.toUpperCase() || "U"}</div>
          <div>
            <h3>{form.name || "Your Name"}</h3>
            <p>{form.email || "your@email.com"}</p>
          </div>
        </div>

        {saved && (
          <div className="success-banner">
            <FaCheckCircle /> Profile updated successfully!
          </div>
        )}
        {error && <div className="auth-error">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="settings-name">
              <FaUser /> Full Name
            </label>
            <input
              id="settings-name"
              name="name"
              type="text"
              value={form.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="settings-email">
              <FaEnvelope /> Email Address
            </label>
            <input
              id="settings-email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary" disabled={loading}>
            {loading ? <FaSpinner className="spin" /> : <FaSave />}
            Save Changes
          </button>
        </form>
      </div>
      <div className="settings-card logout-card">
        <h3>Delete Account</h3>
        <button className="btn btn-danger-outline" onClick={handleLogout}>
          <FaSignOutAlt /> Logout
        </button>
      </div>
    </div>
  );
}