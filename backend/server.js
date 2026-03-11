const express = require("express")
const cors = require("cors")
require("dotenv").config()

const connectDB = require("./config/db")

const app = express()

app.use(cors())
app.use(express.json())

app.get("/", (req,res)=>{
 res.send("WalletShield API Running 🚀")
})

const authRoutes = require("./routes/authRoutes")
const walletRoutes = require("./routes/walletRoutes")
const transactionRoutes = require("./routes/transactionRoutes")
const limitRoutes = require("./routes/limitRoutes")
const dashboardRoutes = require("./routes/dashboardRoutes")
const analyticsRoutes = require("./routes/analyticsRoutes")
const fraudRoutes = require("./routes/fraudRoutes")
const aiRoutes = require("./routes/aiRoutes")
const receiptRoutes = require("./routes/receiptRoutes");
const settlementRoutes = require("./routes/settlementRoutes");


app.use("/api/auth",authRoutes)
app.use("/api/wallet",walletRoutes)
app.use("/api/transactions",transactionRoutes)
app.use("/api/limits",limitRoutes)
app.use("/api/dashboard",dashboardRoutes)
app.use("/api/analytics", analyticsRoutes)
app.use("/api/fraud",fraudRoutes)
app.use("/api/ai", aiRoutes)
app.use("/api/receipts", receiptRoutes);
app.use("/api/settlements", settlementRoutes);

connectDB()

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
 console.log(`🚀 Server running on port ${PORT}`)
})



// const express = require("express")
// const mongoose = require("mongoose")
// const cors = require("cors")
// require("dotenv").config()

// const app = express()

// // Middleware
// app.use(cors())
// app.use(express.json())

// // Default Route
// app.get("/", (req, res) => {
//   res.send("Wallet Shield API Running 🚀")
// })

// /* ---------------- ROUTES ---------------- */

// // Auth Routes
// const authRoutes = require("./routes/authRoutes")
// app.use("/api/auth", authRoutes)

// // Wallet Routes
// const walletRoutes = require("./routes/walletRoutes")
// app.use("/api/wallet", walletRoutes)

// // Transaction Routes
// const transactionRoutes = require("./routes/transactionRoutes")
// app.use("/api/transactions", transactionRoutes)

// // Category Limit Routes
// const limitRoutes = require("./routes/limitRoutes")
// app.use("/api/limits", limitRoutes)

// /* ---------------- DATABASE ---------------- */

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB Connected Successfully")
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB Connection Error:", err)
//   })

// /* ---------------- SERVER ---------------- */

// const PORT = process.env.PORT || 5000

// app.listen(PORT, () => {
//   console.log(`🚀 Server running on port ${PORT}`)
// })


// const express = require("express");
// const mongoose = require("mongoose");
// const cors = require("cors");
// require("dotenv").config();

// const app = express();

// // Middlewares
// app.use(cors());
// app.use(express.json());

// // Test Route
// app.get("/", (req, res) => {
//   res.send("Wallet Guard API Running 🚀");
// });

// // Import Routes
// const authRoutes = require("./routes/authRoutes");
// const walletRoutes = require("./routes/walletRoutes");
// const transactionRoutes = require("./routes/transactionRoutes");
// const limitRoutes = require("./routes/limitRoutes")

// // Use Routes
// app.use("/api/auth", authRoutes);
// app.use("/api/wallet", walletRoutes);
// app.use("/api/transactions", transactionRoutes);
// app.use("/api/limits", limitRoutes)

// // Port
// const PORT = process.env.PORT || 5000;

// // MongoDB Connection
// const connectDB = require("./config/db");

// mongoose
//   .connect(process.env.MONGO_URI)
//   .then(() => {
//     console.log("✅ MongoDB Connected Successfully");
//     app.listen(PORT, () => {
//       console.log(`🚀 Server running on port ${PORT}`);
//     });
//   })
//   .catch((err) => {
//     console.error("❌ MongoDB Connection Failed:", err.message);
//   });