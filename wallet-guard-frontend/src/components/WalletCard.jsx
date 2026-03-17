import { NavLink } from "react-router-dom";

const links = [
  { to: "/dashboard", icon: "📊", label: "Dashboard" },
  { to: "/wallets", icon: "👛", label: "Shared Wallets" },
  { to: "/add-expense", icon: "➕", label: "Add Expense" },
  { to: "/fraud-alerts", icon: "🚨", label: "Fraud Alerts" },
  { to: "/ai-insights", icon: "🤖", label: "AI Insights" },
];

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <ul className="sidebar-links">
        {links.map((link) => (
          <li key={link.to}>
            <NavLink
              to={link.to}
              className={({ isActive }) =>
                "sidebar-link" + (isActive ? " active" : "")
              }
            >
              <span className="sidebar-icon">{link.icon}</span>
              <span className="sidebar-label">{link.label}</span>
            </NavLink>
          </li>
        ))}
      </ul>
    </aside>
  );
}