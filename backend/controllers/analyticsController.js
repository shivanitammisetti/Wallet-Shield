const Transaction = require("../models/Transaction")

exports.getCategorySpending = async (req, res) => {
 try {

  const spending = await Transaction.aggregate([
   {
    $match: {
     userId: req.user.id
    }
   },
   {
    $group: {
     _id: "$category",
     totalSpent: { $sum: "$amount" }
    }
   },
   {
    $project: {
     category: "$_id",
     totalSpent: 1,
     _id: 0
    }
   }
  ])

  res.json({
   message: "Category spending fetched",
   spending
  })

 } catch (error) {
  res.status(500).json({ message: error.message })
 }
}