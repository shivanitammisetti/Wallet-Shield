const Transaction = require("../models/Transaction");
const { calculateSettlement } = require("../services/settlementService");

exports.getSettlement = async (req, res) => {

  try {

    const { walletId } = req.params;

    const transactions = await Transaction.find({ walletId });

    const settlements = calculateSettlement(transactions);

    res.json({
      message: "Settlement calculated",
      settlements
    });

  } catch (error) {

    console.error(error);

    res.status(500).json({
      message: "Settlement calculation failed"
    });

  }

};