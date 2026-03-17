import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:5000/api",
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

export const register = (data) => API.post("/auth/register", data);
export const login = (data) => API.post("/auth/login", data);
export const createWallet = (data) => API.post("/wallet/create", data);
export const getWallets = () => API.get("/wallet");
export const getMemberCount = (walletId) => API.get(`/wallet/member-count/${walletId}`);
export const addMembers = (data) => API.put("/wallet/add-member", data);
export const addExpense = (data) => API.post("/transactions/add", data);
export const getTransactions = (walletId) => API.get(`/transactions?walletId=${walletId}`);
export const filterTransactions = (params) => API.get("/transactions/filter", { params });
export const getDashboard = () => API.get("/dashboard/summary");
export const getCategorySpending = () => API.get("/analytics/category-spending");
export const getFraudAlerts = () => API.get("/fraud/alerts");
export const classifyExpense = (description) => API.post("/ai/classify-expense", { description });
export const scanReceipt = (formData) =>
  API.post("/receipts/scan", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const getSettlement = (walletId) => API.get(`/settlements/wallet/${walletId}`);