import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import Sidebar from "./components/Sidebar";
import Chatbot from "./components/Chatbot";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import SharedWallets from "./pages/SharedWallets";
import WalletDetails from "./pages/WalletDetails";
import AddExpense from "./pages/AddExpense";
import FraudAlerts from "./pages/FraudAlerts";
import AIInsights from "./pages/AIInsights";
import "./index.css";

const isAuth = () => !!localStorage.getItem("token");

function PrivateRoute({ children }) {
  return isAuth() ? children : <Navigate to="/login" />;
}

function AppLayout({ children }) {
  return (
    <div className="app-layout">
      <Navbar />
      <div className="app-body">
        <Sidebar />
        <main className="main-content">{children}</main>
      </div>
      <Chatbot />
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Navigate to="/dashboard" />} />
        <Route path="/dashboard" element={
          <PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>
        } />
        <Route path="/wallets" element={
          <PrivateRoute><AppLayout><SharedWallets /></AppLayout></PrivateRoute>
        } />
        <Route path="/wallets/:walletId" element={
          <PrivateRoute><AppLayout><WalletDetails /></AppLayout></PrivateRoute>
        } />
        <Route path="/add-expense" element={
          <PrivateRoute><AppLayout><AddExpense /></AppLayout></PrivateRoute>
        } />
        <Route path="/fraud-alerts" element={
          <PrivateRoute><AppLayout><FraudAlerts /></AppLayout></PrivateRoute>
        } />
        <Route path="/ai-insights" element={
          <PrivateRoute><AppLayout><AIInsights /></AppLayout></PrivateRoute>
        } />
      </Routes>
    </BrowserRouter>
  );
}


















// import logo from './logo.svg';
// import './App.css';

// function App() {
//   return (
//     <div className="App">
//       <header className="App-header">
//         <img src={logo} className="App-logo" alt="logo" />
//         <p>
//           Edit <code>src/App.js</code> and save to reload.
//         </p>
//         <a
//           className="App-link"
//           href="https://reactjs.org"
//           target="_blank"
//           rel="noopener noreferrer"
//         >
//           Learn React
//         </a>
//       </header>
//     </div>
//   );
// }

// export default App;
