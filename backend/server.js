const express = require("express")
const cors = require("cors")
const dns = require("dns")
dns.setServers(['8.8.8.8','8.8.4.4'])
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
const errorHandler = require("./middleware/errorHandler");  // ← NEW
const userRoutes = require("./routes/userRoutes")
const notificationRoutes = require("./routes/notificationRoutes")
const chatbotRoutes = require("./routes/chatbotRoutes");


app.use("/api/chatbot", chatbotRoutes);
app.use("/api/notifications", notificationRoutes)
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
app.use(errorHandler)  // ← NEW (always last)
app.use("/api/user", userRoutes)
// app.use("/api/wallet", walletRoutes)

connectDB()

const PORT = process.env.PORT || 5000

app.listen(PORT,()=>{
 console.log(`🚀 Server running on port ${PORT}`)
})



// const express = require("express")
// const cors = require("cors")
// require("dotenv").config()

// const connectDB = require("./config/db")

// const app = express()

// app.use(cors())
// app.use(express.json())

// app.get("/", (req,res)=>{
//  res.send("WalletShield API Running 🚀")
// })

// const authRoutes = require("./routes/authRoutes")
// const walletRoutes = require("./routes/walletRoutes")
// const transactionRoutes = require("./routes/transactionRoutes")
// const limitRoutes = require("./routes/limitRoutes")
// const dashboardRoutes = require("./routes/dashboardRoutes")
// const analyticsRoutes = require("./routes/analyticsRoutes")
// const fraudRoutes = require("./routes/fraudRoutes")
// const aiRoutes = require("./routes/aiRoutes")
// const receiptRoutes = require("./routes/receiptRoutes");
// const settlementRoutes = require("./routes/settlementRoutes");


// app.use("/api/auth",authRoutes)
// app.use("/api/wallet",walletRoutes)
// app.use("/api/transactions",transactionRoutes)
// app.use("/api/limits",limitRoutes)
// app.use("/api/dashboard",dashboardRoutes)
// app.use("/api/analytics", analyticsRoutes)
// app.use("/api/fraud",fraudRoutes)
// app.use("/api/ai", aiRoutes)
// app.use("/api/receipts", receiptRoutes);
// app.use("/api/settlements", settlementRoutes);

// connectDB()

// const PORT = process.env.PORT || 5000

// app.listen(PORT,()=>{
//  console.log(`🚀 Server running on port ${PORT}`)
// })