import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { login } from "../services/api";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async () => {
    setLoading(true); setError("");
    try {
      const res = await login(form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally { setLoading(false); }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-logo">🛡</div>
        <h1 className="auth-title">WalletGuard</h1>
        <p className="auth-subtitle">Sign in to your account</p>
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
          {loading ? "Signing in..." : "Sign In"}
        </button>
        <p className="auth-switch">Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </div>
  );
}