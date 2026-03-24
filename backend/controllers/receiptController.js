const { extractReceiptData } = require("../services/ocrService");
const { classifyExpense } = require("../services/aiService");
const Transaction = require("../models/Transaction");
const Wallet = require("../models/Wallet");
const Notification = require("../models/Notification");

exports.scanReceipt = async (req, res) => {
  try {

    const imagePath = req.file.path;
    const userId = req.user.id;
    const { walletId } = req.body;

    // 1️⃣ OCR extract
    const data = await extractReceiptData(imagePath);

    // 2️⃣ AI classify
    const category = await classifyExpense(data.text);

    // 3️⃣ Get wallet
    const wallet = await Wallet.findById(walletId);

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" });
    }

    // ❌ Zero balance check
    if (wallet.balance < data.amount) {
      return res.status(400).json({
        message: "Insufficient balance",
        status: "FAILED"
      });
    }

    // 4️⃣ Create transaction
    const transaction = await Transaction.create({
      userId,
      walletId,
      description: data.merchant,
      amount: data.amount,
      category,
      status: "SUCCESS",
      type: "DEBIT"
    });

    // 5️⃣ Deduct money
    wallet.balance -= data.amount;
    await wallet.save();

    // 6️⃣ Notification
    await Notification.create({
      userId,
      message: `₹${data.amount} spent via receipt (${category})`,
      type: "transaction"
    });

    res.json({
      message: "Receipt processed successfully ✅",
      transaction
    });

  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: "Receipt processing failed"
    });
  }
};





// const { extractReceiptData } = require("../services/ocrService");
// const { classifyExpense } = require("../services/aiService");
// const Transaction = require("../models/Transaction");

// exports.scanReceipt = async (req, res) => {

//   try {

//     const imagePath = req.file.path;

//     // OCR extraction
//     const data = await extractReceiptData(imagePath);

//     // AI category detection
//     // const category = await classifyExpense(data.merchant);
//     const category = await classifyExpense(data.text);

//     // create transaction
//     const transaction = new Transaction({
//       userId: req.user.id,
//       walletId: req.body.walletId,
//       description: data.merchant,
//       amount: data.amount,
//       category: category
// });
//     // const transaction = new Transaction({
//     //   description: data.merchant,
//     //   amount: data.amount,
//     //   category: category
//     // });

//     await transaction.save();

//     res.json({
//       message: "Receipt scanned and transaction created",
//       merchant: data.merchant,
//       amount: data.amount,
//       category: category
//     });

//   } catch (error) {

//     console.error(error);

//     res.status(500).json({
//       message: "Receipt processing failed"
//     });

//   }

// };




// const { extractReceiptData } = require("../services/ocrService");
// const { classifyExpense } = require("../services/aiService");
// const Transaction = require("../models/Transaction");

// exports.scanReceipt = async (req, res) => {

//   try {

//     const imagePath = req.file.path;

//     const data = await extractReceiptData(imagePath);

//     res.json({
//       message: "Receipt scanned successfully",
//       merchant: data.merchant,
//       amount: data.amount,
//       date: data.date
//   });

//   } catch (error) {

//     res.status(500).json({
//       message: "Receipt scanning failed"
//     });

//   }

// };