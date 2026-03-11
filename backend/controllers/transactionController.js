const Transaction = require("../models/Transaction")
const Wallet = require("../models/Wallet")
const detectFraud = require("../utils/fraudDetector")
const FraudAlert = require("../models/FraudAlert")

// Add Expense
exports.addExpense = async (req, res) => {
  try {

    const { walletId, description, amount, category, splitBetween } = req.body
    const userId = req.user.id

    // Find wallet
    const wallet = await Wallet.findById(walletId)

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" })
    }

    let splitData = []

    // Group Expense
    if (splitBetween && splitBetween.length > 0) {

      const splitAmount = amount / splitBetween.length

      splitData = splitBetween.map(memberId => ({
        user: memberId,
        amount: splitAmount
      }))

    } 
    else {

      // Individual Expense
      splitData = [{
        user: userId,
        amount: amount
      }]

    }

    // Detect fraud
    const fraudWarning = await detectFraud(userId, category)

    // Save fraud alert if detected
    if (fraudWarning) {
      await FraudAlert.create({
        userId,
        category,
        amount,
        message: fraudWarning
      })
    }

    // Create transaction
    const transaction = await Transaction.create({
      walletId,
      userId,
      description,
      category,
      amount,
      isGroupExpense: splitBetween && splitBetween.length > 0,
      splitBetween: splitData
    })

    // Update wallet balance
    wallet.balance = wallet.balance + amount
    await wallet.save()

    res.json({
      message: "Expense added successfully",
      fraudWarning,
      transaction
    })

  } catch (err) {

    console.error(err)
    res.status(500).json({ error: "Internal Server Error" })

  }
}


// Get Transactions
exports.getTransactions = async (req, res) => {

  try {

    const { walletId } = req.query

    const transactions = await Transaction.find({ walletId })
      .populate("userId", "name")
      .populate("splitBetween.user", "name")

    res.json(transactions)

  } catch (err) {

    console.error(err)
    res.status(500).json({ error: "Internal Server Error" })

  }

}


// Filter Transactions
exports.filterTransactions = async (req, res) => {

  try {

    const { category, walletId, startDate, endDate } = req.query

    let filter = {
      userId: req.user.id
    }

    if (category) {
      filter.category = category
    }

    if (walletId) {
      filter.walletId = walletId
    }

    if (startDate || endDate) {

      filter.createdAt = {}

      if (startDate) {
        filter.createdAt.$gte = new Date(startDate)
      }

      if (endDate) {
        filter.createdAt.$lte = new Date(endDate)
      }

    }

    const transactions = await Transaction
      .find(filter)
      .sort({ createdAt: -1 })

    res.json({
      count: transactions.length,
      transactions
    })

  } catch (error) {

    res.status(500).json({ message: error.message })

  }

}


// const Transaction = require("../models/Transaction")
// const Wallet = require("../models/Wallet")
// const detectFraud = require("../utils/fraudDetector")
// const FraudAlert = require("../models/FraudAlert")

// // Add Expense
// exports.addExpense = async (req, res) => {
//   try {

//     // const { walletId, description, amount, category } = req.body
//     const { walletId, description, amount, category, splitBetween } = req.body
//     const userId = req.user.id

//     // Find wallet
//     const wallet = await Wallet.findById(walletId)

//     if (!wallet) {
//       return res.status(404).json({ message: "Wallet not found" })
//     }

//     // Get wallet members
//     const members = wallet.members

//     // Split amount
//     // const splitAmount = Number((amount / members.length).toFixed(2))

//     // const splitData = members.map(member => ({
//     //   user: member,
//     //   amount: splitAmount
//     // }))

//     let splitData = [];

//     if (splitBetween && splitBetween.length > 0) {

//     const splitAmount = amount / splitBetween.length;

//     splitData = splitBetween.map(userId => ({
//       user: userId,
//       amount: splitAmount
//   }));

//   } else {

//   // Individual expense (no split)
//     splitData = [{
//       user: req.user.id,
//       amount: amount
//   }];

// }

//     // Get recent transactions for fraud detection
//     const recentTransactions = await Transaction.find({ walletId })

//     // Detect fraud
//     // const fraudWarning = detectFraud(amount, recentTransactions)
//     const fraudWarning = await detectFraud(userId, category)

//     // Create transaction
//     // const transaction = new Transaction({
//     //   walletId,
//     //   userId,
//     //   description,
//     //   amount,
//     //   category,
//     //   splitBetween: splitData
//     // })

//     const transaction = await Transaction.create({
//       walletId,
//       userId: req.user.id,
//       description,
//       category,
//       amount,
//       isGroupExpense: splitBetween && splitBetween.length > 0,
//       splitBetween: splitData
//   });

//     // await transaction.save()

//     // Update wallet balance
//     wallet.balance = wallet.balance + amount
//     await wallet.save()

//     res.json({
//       message: "Expense added and split successfully",
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

// exports.filterTransactions = async (req, res) => {
//  try {

//   const { category, walletId, startDate, endDate } = req.query

//   let filter = {
//    userId: req.user.id
//   }

//   if (category) {
//    filter.category = category
//   }

//   if (walletId) {
//    filter.walletId = walletId
//   }

//   if (startDate || endDate) {
//    filter.createdAt = {}

//    if (startDate) {
//     filter.createdAt.$gte = new Date(startDate)
//    }

//    if (endDate) {
//     filter.createdAt.$lte = new Date(endDate)
//    }
//   }

//   const transactions = await Transaction.find(filter).sort({ createdAt: -1 })

//   res.json({
//    count: transactions.length,
//    transactions
//   })

//  } catch (error) {
//   res.status(500).json({ message: error.message })
//  }
// }