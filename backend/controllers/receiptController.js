const { extractReceiptData } = require("../services/ocrService");
const { classifyExpense } = require("../services/aiService");
const Transaction = require("../models/Transaction");

exports.scanReceipt = async (req, res) => {

  try {

    const imagePath = req.file.path;

    // OCR extraction
    const data = await extractReceiptData(imagePath);

    // AI category detection
    // const category = await classifyExpense(data.merchant);
    const category = await classifyExpense(data.text);

    // create transaction
    const transaction = new Transaction({
      userId: req.user.id,
      walletId: req.body.walletId,
      description: data.merchant,
      amount: data.amount,
      category: category
});
    // const transaction = new Transaction({
    //   description: data.merchant,
    //   amount: data.amount,
    //   category: category
    // });

    await transaction.save();

    res.json({
      message: "Receipt scanned and transaction created",
      merchant: data.merchant,
      amount: data.amount,
      category: category
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