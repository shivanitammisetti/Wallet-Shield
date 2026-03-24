const Wallet = require("../models/Wallet");
const Transaction = require("../models/Transaction");
const Notification = require("../models/Notification");
const User = require("../models/User");

const { getSuggestions } = require("../services/spendingAdvisor");
const { generateInsights } = require("../services/insightService");

exports.getDashboardSummary = async (req, res) => {
  try {
    const userId = req.user.id;

    // 🔹 Get user (for profile flag)
    const user = await User.findById(userId);

    // 1️⃣ Wallets
    const wallets = await Wallet.find({ members: userId });
    const walletIds = wallets.map(w => w._id);

    // 2️⃣ Total Balance
    let totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

    // 3️⃣ Transactions
    const transactions = await Transaction.find({
      walletId: { $in: walletIds }
    });

    // 4️⃣ Total Spent (only SUCCESS debit)
    let totalSpent = 0;
    transactions.forEach(tx => {
      if (tx.type === "DEBIT" && tx.status === "SUCCESS") {
        totalSpent += tx.amount;
      }
    });

    // 5️⃣ Monthly Graph Data 📈
    const monthlyData = {};

    transactions.forEach(tx => {
      const month = new Date(tx.createdAt).toLocaleString("default", { month: "short" });

      if (!monthlyData[month]) {
        monthlyData[month] = 0;
      }

      if (tx.type === "DEBIT" && tx.status === "SUCCESS") {
        monthlyData[month] += tx.amount;
      }
    });

    // 6️⃣ Category Pie Chart 🥧
    const categoryMap = {};

    transactions.forEach(tx => {
      if (tx.status === "SUCCESS") {
        if (!categoryMap[tx.category]) {
          categoryMap[tx.category] = 0;
        }
        categoryMap[tx.category] += tx.amount;
      }
    });

    // 7️⃣ Recent Transactions
    const recentTransactions = await Transaction.find({
      walletId: { $in: walletIds }
    })
      .sort({ createdAt: -1 })
      .limit(5);

    // 8️⃣ AI Suggestions + Insights
    const suggestions = getSuggestions(categoryMap);
    const insights = generateInsights(transactions);

    // 9️⃣ Notification Count (only unread)
    const notificationCount = await Notification.countDocuments({
      userId,
      isRead: false
    });

    // 🔟 FINAL RESPONSE
    res.json({
      isProfileComplete: user.isProfileComplete, // ✅ NEW
      totalWallets: wallets.length,
      totalBalance,
      totalSpent,
      monthlyData,
      categorySpending: categoryMap,
      recentTransactions,
      suggestions,
      insights,
      notificationCount
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Dashboard error" });
  }
};





// const Wallet = require("../models/Wallet");
// const Transaction = require("../models/Transaction");
// const Notification = require("../models/Notification");

// const { getSuggestions } = require("../services/spendingAdvisor");
// const { generateInsights } = require("../services/insightService");

// exports.getDashboardSummary = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     // 1️⃣ Wallets
//     const wallets = await Wallet.find({ members: userId });
//     const walletIds = wallets.map(w => w._id);

//     // 2️⃣ Total Balance
//     let totalBalance = wallets.reduce((sum, w) => sum + w.balance, 0);

//     // 3️⃣ Transactions
//     const transactions = await Transaction.find({
//       walletId: { $in: walletIds }
//     });

//     // 4️⃣ Total Spent
//     let totalSpent = 0;
//     transactions.forEach(tx => {
//       if (tx.type === "DEBIT" && tx.status === "SUCCESS") {
//         totalSpent += tx.amount;
//       }
//     });

//     // 5️⃣ Monthly Graph Data 📈
//     const monthlyData = {};

//     transactions.forEach(tx => {
//       const month = new Date(tx.createdAt).toLocaleString("default", { month: "short" });

//       if (!monthlyData[month]) {
//         monthlyData[month] = 0;
//       }

//       if (tx.type === "DEBIT" && tx.status === "SUCCESS") {
//         monthlyData[month] += tx.amount;
//       }
//     });

//     // 6️⃣ Category Pie Chart 🥧
//     const categoryMap = {};

//     transactions.forEach(tx => {
//       if (tx.status === "SUCCESS") {
//         if (!categoryMap[tx.category]) {
//           categoryMap[tx.category] = 0;
//         }
//         categoryMap[tx.category] += tx.amount;
//       }
//     });

//     // 7️⃣ Recent Transactions
//     const recentTransactions = await Transaction.find({
//       walletId: { $in: walletIds }
//     })
//       .sort({ createdAt: -1 })
//       .limit(5);

//     // 8️⃣ AI Suggestions + Insights
//     const suggestions = getSuggestions(categoryMap);
//     const insights = generateInsights(transactions);

//     // 9️⃣ Notifications Count 🔔
//     const notificationCount = await Notification.countDocuments({
//       userId
//     });

//     res.json({
//       totalWallets: wallets.length,
//       totalBalance,
//       totalSpent,
//       monthlyData,
//       categorySpending: categoryMap,
//       recentTransactions,
//       suggestions,
//       insights,
//       notificationCount
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Dashboard error" });
//   }
// };






// const Wallet = require("../models/Wallet");
// const Transaction = require("../models/Transaction");

// const { getSuggestions } = require("../services/spendingAdvisor");
// const { generateInsights } = require("../services/insightService");
// const { predictMonthlySpend } = require("../services/budgetPredictor");
// const { generateAdvice } = require("../services/financialAdvisor");

// exports.getDashboardSummary = async (req, res) => {
//   try {
//     const userId = req.user.id;

//     // 1️⃣ Get all wallets of the user
//     const wallets = await Wallet.find({ members: userId });
//     const walletIds = wallets.map((w) => w._id);

//     // 2️⃣ Calculate Total Wallet Balance
//     let totalBalance = 0;
//     wallets.forEach((wallet) => {
//       totalBalance += wallet.balance;
//     });

//     // 3️⃣ Get all transactions from these wallets
//     const transactions = await Transaction.find({
//       walletId: { $in: walletIds },
//     });

//     // 4️⃣ Calculate Total Spending
//     let totalSpent = 0;
//     transactions.forEach((transaction) => {
//       totalSpent += transaction.amount;
//     });

//     // 5️⃣ Predict Monthly Spending
//     const prediction = predictMonthlySpend(transactions);

//     // 6️⃣ Generate Financial Advice
//     const advice = generateAdvice(transactions);

//     // 7️⃣ Category-wise spending
//     const categoryMap = {};

//     transactions.forEach((transaction) => {
//       if (!categoryMap[transaction.category]) {
//         categoryMap[transaction.category] = 0;
//       }

//       categoryMap[transaction.category] += transaction.amount;
//     });

//     // 8️⃣ Smart Suggestions
//     const suggestions = getSuggestions(categoryMap);

//     // 9️⃣ AI Insights
//     const insights = generateInsights(transactions);

//     // 🔟 Recent Transactions
//     const recentTransactions = await Transaction.find({
//       walletId: { $in: walletIds },
//     })
//       .sort({ createdAt: -1 })
//       .limit(5);

//     // 📊 Send Dashboard Response
//     res.json({
//       totalWallets: wallets.length,
//       totalBalance,
//       totalSpent,
//       categorySpending: categoryMap,
//       suggestions,
//       insights,
//       prediction,
//       advice,
//       recentTransactions,
//     });

//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Dashboard error" });
//   }
// };










// const Wallet = require("../models/Wallet")
// const Transaction = require("../models/Transaction")

// exports.getDashboardSummary = async (req,res)=>{

//  try{

//   const userId = req.user.id

//   // 1️⃣ Get wallets of user
//   const wallets = await Wallet.find({ members:userId })

//   const walletIds = wallets.map(w=>w._id)

//   // 2️⃣ Total Wallet Balance
//   let totalBalance = 0
//   wallets.forEach(w=>{
//    totalBalance += w.balance
//   })

//   // 3️⃣ Total Spending
//   const transactions = await Transaction.find({
//    walletId:{$in:walletIds}
//   })

//   let totalSpent = 0
//   transactions.forEach(t=>{
//    totalSpent += t.amount
//   })

//   // 4️⃣ Category Spending
//   const categoryMap = {}

//   transactions.forEach(t=>{
//    if(!categoryMap[t.category]){
//     categoryMap[t.category] = 0
//    }
//    categoryMap[t.category] += t.amount
//   })

//   // 5️⃣ Recent Transactions
//   const recentTransactions = await Transaction.find({
//    walletId:{$in:walletIds}
//   })
//   .sort({createdAt:-1})
//   .limit(5)

//   res.json({
//    totalWallets: wallets.length,
//    totalBalance,
//    totalSpent,
//    categorySpending: categoryMap,
//    recentTransactions
//   })

//  }catch(err){

//   console.error(err)
//   res.status(500).json({message:"Dashboard error"})

//  }

// }