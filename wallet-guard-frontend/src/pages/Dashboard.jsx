import { useEffect, useState } from "react";
import { getDashboard } from "../services/api";
import TransactionList from "../components/TransactionList";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from "recharts";

const COLORS = ["#6366f1","#f59e0b","#10b981","#ef4444","#3b82f6","#8b5cf6","#f97316"];

export default function Dashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDashboard().then((res) => setData(res.data)).catch(console.error).finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="loading">Loading dashboard...</div>;
  if (!data) return <div className="empty-msg">No data found.</div>;

  const chartData = Object.entries(data.categorySpending || {}).map(([name, value]) => ({ name, value }));

  return (
    <div className="page">
      <h2 className="page-title">📊 Dashboard</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Wallets</span>
          <span className="stat-value">{data.totalWallets}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Balance</span>
          <span className="stat-value">₹{data.totalBalance?.toFixed(2)}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Total Spent</span>
          <span className="stat-value">₹{data.totalSpent?.toFixed(2)}</span>
        </div>
      </div>
      {chartData.length > 0 && (
        <div className="card">
          <h3>Spending by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={chartData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={100}>
                {chartData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip formatter={(v) => `₹${v}`} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      )}
      <div className="card">
        <h3>Recent Transactions</h3>
        <TransactionList transactions={data.recentTransactions} />
      </div>
    </div>
  );
}