import { useEffect, useState } from "react";
import { getCategorySpending, classifyExpense } from "../services/api";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, Cell } from "recharts";

const COLORS = ["#6366f1","#f59e0b","#10b981","#ef4444","#3b82f6","#8b5cf6","#f97316","#06b6d4"];

export default function AIInsights() {
  const [spending, setSpending] = useState([]);
  const [desc, setDesc] = useState("");
  const [classified, setClassified] = useState(null);
  const [loading, setLoading] = useState(true);
  const [classLoading, setClassLoading] = useState(false);

  useEffect(() => {
    getCategorySpending().then((res) => setSpending(res.data.spending || [])).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleClassify = async () => {
    if (!desc.trim()) return;
    setClassLoading(true);
    try {
      const res = await classifyExpense(desc);
      setClassified(res.data.category);
    } catch { setClassified("Could not classify"); }
    finally { setClassLoading(false); }
  };

  const topCategory = spending.reduce((max, s) => (s.totalSpent > (max?.totalSpent || 0) ? s : max), null);

  return (
    <div className="page">
      <h2 className="page-title">🤖 AI Insights</h2>
      {topCategory && (
        <div className="card insight-banner">
          <span className="insight-icon">💡</span>
          <p>You spend the most on <strong>{topCategory.category}</strong> — ₹{topCategory.totalSpent?.toFixed(2)} total. Consider setting a limit!</p>
        </div>
      )}
      <div className="card">
        <h3>Spending by Category</h3>
        {loading ? <p className="loading">Loading...</p> : spending.length === 0 ? <p className="empty-msg">No spending data yet.</p> : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={spending}>
              <CartesianGrid strokeDasharray="3 3" stroke="#2d2d3d" />
              <XAxis dataKey="category" tick={{ fill: "#a0a0b8" }} />
              <YAxis tick={{ fill: "#a0a0b8" }} />
              <Tooltip formatter={(v) => `₹${v}`} contentStyle={{ background: "#1a1a2e", border: "1px solid #3d3d5c" }} />
              <Bar dataKey="totalSpent" radius={[6, 6, 0, 0]}>
                {spending.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>
      <div className="card">
        <h3>🏷 AI Expense Classifier</h3>
        <p className="card-subtitle">Type any expense description and AI will categorize it</p>
        <div className="form-row">
          <input className="input-field" placeholder="e.g. bought medicine at pharmacy"
            value={desc} onChange={(e) => setDesc(e.target.value)} />
          <button className="btn-primary" onClick={handleClassify} disabled={classLoading}>
            {classLoading ? "Classifying..." : "Classify"}
          </button>
        </div>
        {classified && <div className="classify-result">🏷 Category: <strong>{classified}</strong></div>}
      </div>
    </div>
  );
}