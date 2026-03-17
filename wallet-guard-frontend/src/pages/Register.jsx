import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/api";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      await register(form);
      navigate("/login");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🛡</div>
        <h1 className="auth-title">WalletGuard</h1>
        <p className="auth-subtitle">Create your account</p>
        <div className="form-group">
          <label>Name</label>
          <input type="text" name="name" placeholder="Your Name"
            value={form.name} onChange={handleChange} className="input-field" />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input type="email" name="email" placeholder="you@email.com"
            value={form.email} onChange={handleChange} className="input-field" />
        </div>
        <div className="form-group">
          <label>Password</label>
          <input type="password" name="password" placeholder="••••••••"
            value={form.password} onChange={handleChange} className="input-field" />
        </div>
        {error && <p className="error-msg">{error}</p>}
        <button onClick={handleSubmit} disabled={loading} className="btn-primary full-width">
          {loading ? "Registering..." : "Create Account"}
        </button>
        <p className="auth-switch">Already have an account? <Link to="/login">Sign In</Link></p>
      </div>
    </div>
  );
}