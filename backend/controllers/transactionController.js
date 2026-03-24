const Transaction = require("../models/Transaction")
const Wallet = require("../models/Wallet")
const detectFraud = require("../utils/fraudDetector")
const FraudAlert = require("../models/FraudAlert")
const { classifyExpense } = require("../services/aiService")
const Notification = require("../models/Notification")

// 🔥 ADD EXPENSE (SMART WALLET)
exports.addExpense = async (req, res) => {
  try {
    const { description, amount } = req.body
    const userId = req.user.id

    // 🤖 Auto category detection
    const category = await classifyExpense(description)

    // 🔍 Auto wallet selection
    let wallet = await Wallet.findOne({
      members: userId,
      category: category
    })

    // fallback wallet
    if (!wallet) {
      wallet = await Wallet.findOne({ members: userId })
    }

    if (!wallet) {
      return res.status(404).json({ message: "No wallet found" })
    }

    // ❌ ZERO BALANCE CHECK
    if (wallet.balance < amount) {
      return res.status(400).json({
        message: "Insufficient balance",
        status: "FAILED",
        action: "ADD_MONEY"
      })
    }

    // 🔍 FRAUD CHECK
    const fraudWarning = await detectFraud(userId, category)

    let status = "SUCCESS"
    if (fraudWarning) {
      status = "FRAUD"
    }

    // 💾 SAVE TRANSACTION
    const transaction = await Transaction.create({
      walletId: wallet._id,
      userId,
      description,
      category,
      amount,
      status,
      type: "DEBIT"
    })

    // 💰 UPDATE BALANCE
    if (status === "SUCCESS") {
      wallet.balance -= amount
      await wallet.save()
    }

    // 🔔 NOTIFICATION
    await Notification.create({
      userId,
      message: `₹${amount} spent on ${category} (${status})`,
      type: status === "FRAUD" ? "fraud" : "transaction"
    })

    res.json({
      message: "Transaction processed",
      status,
      walletUsed: wallet.name, // ✅ helpful for frontend
      transaction
    })

  } catch (err) {
    console.error(err)
    res.status(500).json({ message: "Server error" })
  }
}


// 🔹 GET TRANSACTIONS
exports.getTransactions = async (req, res) => {
  try {
    const { walletId } = req.query;

    const transactions = await Transaction.find({ walletId })
      .sort({ createdAt: -1 });

    const formatted = transactions.map(tx => ({
      id: tx._id,
      category: tx.category,
      amount: tx.amount,
      date: tx.createdAt,
      status: tx.status,
      type: tx.type
    }));

    res.json(formatted);

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// 🔹 FILTER TRANSACTIONS
exports.filterTransactions = async (req, res) => {
  try {
    const { category, walletId, startDate, endDate } = req.query
    let filter = { userId: req.user.id }

    if (category) filter.category = category
    if (walletId) filter.walletId = walletId

    if (startDate || endDate) {
      filter.createdAt = {}
      if (startDate) filter.createdAt.$gte = new Date(startDate)
      if (endDate) filter.createdAt.$lte = new Date(endDate)
    }

    const transactions = await Transaction.find(filter).sort({ createdAt: -1 })

    res.json({ count: transactions.length, transactions })

  } catch (error) {
    res.status(500).json({ message: error.message })
  }
}


// 🔹 TRANSFER MONEY
exports.transferMoney = async (req, res) => {
  try {
    const { fromWalletId, toWalletId, amount } = req.body
    const userId = req.user.id

    const fromWallet = await Wallet.findById(fromWalletId)
    const toWallet = await Wallet.findById(toWalletId)

    if (!fromWallet || !toWallet) {
      return res.status(404).json({ message: "Wallet not found" })
    }

    if (fromWallet.balance < amount) {
      return res.status(400).json({ message: "Insufficient balance" })
    }

    // Debit
    fromWallet.balance -= amount
    await fromWallet.save()

    // Credit
    toWallet.balance += amount
    await toWallet.save()

    // Save transaction
    await Transaction.create({
      walletId: fromWalletId,
      userId,
      amount,
      category: "Transfer",
      status: "SUCCESS",
      type: "DEBIT",
      description: "Wallet transfer"
    })

    // Notification
    await Notification.create({
      userId,
      message: `₹${amount} transferred successfully`,
      type: "transaction"
    })

    res.json({ message: "Transfer successful ✅" })

  } catch (err) {
    res.status(500).json(err)
  }
}





// const Transaction = require("../models/Transaction")
// const Wallet = require("../models/Wallet")
// const detectFraud = require("../utils/fraudDetector")
// const FraudAlert = require("../models/FraudAlert")
// const { classifyExpense } = require("../services/aiService")

// // Add Expense
// const Notification = require("../models/Notification")

// exports.addExpense = async (req, res) => {
//   try {
//     const { walletId, description, amount } = req.body
//     const userId = req.user.id

//     const wallet = await Wallet.findById(walletId)

//     if (!wallet) {
//       return res.status(404).json({ message: "Wallet not found" })
//     }

//     // ❌ ZERO BALANCE CHECK
//     if (wallet.balance < amount) {
//   return res.status(400).json({
//     message: "Insufficient balance",
//     status: "FAILED",
//     action: "ADD_MONEY"   // 🔥 frontend can show popup
//   });
// }
//     // if (wallet.balance < amount) {
//     //   return res.status(400).json({
//     //     message: "Insufficient balance ❌",
//     //     status: "FAILED"
//     //   })
//     // }

//     const category = await classifyExpense(description)

//     // 🔍 FRAUD CHECK
//     const fraudWarning = await detectFraud(userId, category)

//     let status = "SUCCESS"

//     if (fraudWarning) {
//       status = "FRAUD"
//     }

//     // 💾 SAVE TRANSACTION
//     const transaction = await Transaction.create({
//       walletId,
//       userId,
//       description,
//       category,
//       amount,
//       status,
//       type: "DEBIT"
//     })

//     // 💰 UPDATE BALANCE ONLY IF SUCCESS
//     if (status === "SUCCESS") {
//       wallet.balance -= amount
//       await wallet.save()
//     }

//     // 🔔 CREATE NOTIFICATION
//     await Notification.create({
//       userId,
//       message: `₹${amount} spent on ${category} (${status})`,
//       type: status === "FRAUD" ? "fraud" : "transaction"
//     })

//     res.json({
//       message: "Transaction processed",
//       status,
//       transaction
//     })

//   } catch (err) {
//     console.error(err)
//     res.status(500).json({ message: "Server error" })
//   }
// }
// // exports.addExpense = async (req, res) => {
// //   try {
// //     const { walletId, description, amount, splitBetween } = req.body
// //     const userId = req.user.id

// //     const wallet = await Wallet.findById(walletId)
// //     if (!wallet) {
// //       return res.status(404).json({ message: "Wallet not found" })
// //     }

// //     const category = await classifyExpense(description)

// //     let splitData = []
// //     if (splitBetween && splitBetween.length > 0) {
// //       const splitAmount = amount / splitBetween.length
// //       splitData = splitBetween.map(memberId => ({
// //         user: memberId,
// //         amount: splitAmount
// //       }))
// //     } else {
// //       splitData = [{ user: userId, amount: amount }]
// //     }

// //     const fraudWarning = await detectFraud(userId, category, amount)
// //     if (fraudWarning) {
// //       await FraudAlert.create({ userId, category, amount, message: fraudWarning })
// //     }

// //     const transaction = await Transaction.create({
// //       walletId, userId, description, category, amount,
// //       isGroupExpense: splitBetween && splitBetween.length > 0,
// //       splitBetween: splitData
// //     })

// //     wallet.balance = wallet.balance - amount
// //     await wallet.save()

// //     res.json({ message: "Expense added successfully", category, fraudWarning, transaction })

// //   } catch (err) {
// //     console.error(err)
// //     res.status(500).json({ error: "Internal Server Error" })
// //   }
// // }

// // Get Transactions
// exports.getTransactions = async (req, res) => {
//   try {
//     const { walletId } = req.query;

//     const transactions = await Transaction.find({ walletId })
//       .sort({ createdAt: -1 });

//     const formatted = transactions.map(tx => ({
//       id: tx._id,
//       category: tx.category,
//       amount: tx.amount,
//       date: tx.createdAt,
//       status: tx.status,
//       type: tx.type
//     }));

//     res.json(formatted);

//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
// // exports.getTransactions = async (req, res) => {
// //   try {
// //     const { walletId } = req.query
// //     const transactions = await Transaction.find({ walletId })
// //       .populate("userId", "name")
// //       .populate("splitBetween.user", "name")
// //     res.json(transactions)
// //   } catch (err) {
// //     console.error(err)
// //     res.status(500).json({ error: "Internal Server Error" })
// //   }
// // }

// // Filter Transactions
// exports.filterTransactions = async (req, res) => {
//   try {
//     const { category, walletId, startDate, endDate } = req.query
//     let filter = { userId: req.user.id }

//     if (category) filter.category = category
//     if (walletId) filter.walletId = walletId

//     if (startDate || endDate) {
//       filter.createdAt = {}
//       if (startDate) filter.createdAt.$gte = new Date(startDate)
//       if (endDate) filter.createdAt.$lte = new Date(endDate)
//     }

//     const transactions = await Transaction.find(filter).sort({ createdAt: -1 })

//     res.json({ count: transactions.length, transactions })

//   } catch (error) {
//     res.status(500).json({ message: error.message })
//   }
// }



// exports.transferMoney = async (req, res) => {
//   try {
//     const { fromWalletId, toWalletId, amount } = req.body
//     const userId = req.user.id

//     const fromWallet = await Wallet.findById(fromWalletId)
//     const toWallet = await Wallet.findById(toWalletId)

//     if (!fromWallet || !toWallet) {
//       return res.status(404).json({ message: "Wallet not found" })
//     }

//     if (fromWallet.balance < amount) {
//       return res.status(400).json({ message: "Insufficient balance" })
//     }

//     // Debit
//     fromWallet.balance -= amount
//     await fromWallet.save()

//     // Credit
//     toWallet.balance += amount
//     await toWallet.save()

//     // Save transaction
//     await Transaction.create({
//       walletId: fromWalletId,
//       userId,
//       amount,
//       category: "Transfer",
//       status: "SUCCESS",
//       type: "DEBIT",
//       description: "Wallet transfer"
//     })

//     await Notification.create({
//       userId,
//       message: `₹${amount} transferred successfully`,
//       type: "transaction"
//     })

//     res.json({ message: "Transfer successful ✅" })

//   } catch (err) {
//     res.status(500).json(err)
//   }
// }




// const Transaction = require("../models/Transaction")
// const Wallet = require("../models/Wallet")
// const detectFraud = require("../utils/fraudDetector")
// const FraudAlert = require("../models/FraudAlert")
// const { classifyExpense } = require("../services/aiService")

// // Add Expense
// exports.addExpense = async (req, res) => {

//   try {

//     const { walletId, description, amount, splitBetween } = req.body
//     const userId = req.user.id

//     const wallet = await Wallet.findById(walletId)

//     if (!wallet) {
//       return res.status(404).json({ message: "Wallet not found" })
//     }

//     // AI category detection
//     const category = await classifyExpense(description)

//     let splitData = []

//     if (splitBetween && splitBetween.length > 0) {

//       const splitAmount = amount / splitBetween.length

//       splitData = splitBetween.map(memberId => ({
//         user: memberId,
//         amount: splitAmount
//       }))

//     } else {

//       splitData = [{
//         user: userId,
//         amount: amount
//       }]

//     }

//     const fraudWarning = await detectFraud(userId, category, amount)

//     if (fraudWarning) {
//       await FraudAlert.create({
//         userId,
//         category,
//         amount,
//         message: fraudWarning
//       })
//     }

//     const transaction = await Transaction.create({
//       walletId,
//       userId,
//       description,
//       category,
//       amount,
//       isGroupExpense: splitBetween && splitBetween.length > 0,
//       splitBetween: splitData
//     })

//     // wallet.balance = wallet.balance - amount
//     wallet.balance = wallet.balance - amount
//     await wallet.save()

//     res.json({
//       message: "Expense added successfully",
//       category,
//       fraudWarning,
//       transaction
//     })

//   } catch (err) {

//     console.error(err)
//     res.status(500).json({ error: "Internal Server Error" })

//   }

// }











// const Transaction = require("../models/Transaction")
// const Wallet = require("../models/Wallet")
// const detectFraud = require("../utils/fraudDetector")
// const FraudAlert = require("../models/FraudAlert")

// // Add Expense
// exports.addExpense = async (req, res) => {
//   try {

//     const { walletId, description, amount, category, splitBetween } = req.body
//     const userId = req.user.id

//     // Find wallet
//     const wallet = await Wallet.findById(walletId)

//     if (!wallet) {
//       return res.status(404).json({ message: "Wallet not found" })
//     }

//     let splitData = []

//     // Group Expense
//     if (splitBetween && splitBetween.length > 0) {

//       const splitAmount = amount / splitBetween.length

//       splitData = splitBetween.map(memberId => ({
//         user: memberId,
//         amount: splitAmount
//       }))

//     } 
//     else {

//       // Individual Expense
//       splitData = [{
//         user: userId,
//         amount: amount
//       }]

//     }

//     // Detect fraud
//     const fraudWarning = await detectFraud(userId, category)

//     // Save fraud alert if detected
//     if (fraudWarning) {
//       await FraudAlert.create({
//         userId,
//         category,
//         amount,
//         message: fraudWarning
//       })
//     }

//     // Create transaction
//     const transaction = await Transaction.create({
//       walletId,
//       userId,
//       description,
//       category,
//       amount,
//       isGroupExpense: splitBetween && splitBetween.length > 0,
//       splitBetween: splitData
//     })

//     // Update wallet balance
//     wallet.balance = wallet.balance + amount
//     await wallet.save()

//     res.json({
//       message: "Expense added successfully",
//       fraudWarning,
//       transaction
//     })

//   } catch (err) {

//     console.error(err)
//     res.status(500).json({ error: "Internal Server Error" })

//   }
// }


// // Get Transactions
// exports.getTransactions = async (req, res) => {

//   try {

//     const { walletId } = req.query

//     const transactions = await Transaction.find({ walletId })
//       .populate("userId", "name")
//       .populate("splitBetween.user", "name")

//     res.json(transactions)

//   } catch (err) {

//     console.error(err)
//     res.status(500).json({ error: "Internal Server Error" })

//   }

// }


// // Filter Transactions
// exports.filterTransactions = async (req, res) => {

//   try {

//     const { category, walletId, startDate, endDate } = req.query

//     let filter = {
//       userId: req.user.id
//     }

//     if (category) {
//       filter.category = category
//     }

//     if (walletId) {
//       filter.walletId = walletId
//     }

//     if (startDate || endDate) {

//       filter.createdAt = {}

//       if (startDate) {
//         filter.createdAt.$gte = new Date(startDate)
//       }

//       if (endDate) {
//         filter.createdAt.$lte = new Date(endDate)
//       }

//     }

//     const transactions = await Transaction
//       .find(filter)
//       .sort({ createdAt: -1 })

//     res.json({
//       count: transactions.length,
//       transactions
//     })

//   } catch (error) {

//     res.status(500).json({ message: error.message })

//   }

// }
