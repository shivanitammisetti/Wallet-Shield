const Wallet = require("../models/Wallet")
const Transaction = require("../models/Transaction")

exports.getDashboardSummary = async (req,res)=>{

 try{

  const userId = req.user.id

  // 1️⃣ Get wallets of user
  const wallets = await Wallet.find({ members:userId })

  const walletIds = wallets.map(w=>w._id)

  // 2️⃣ Total Wallet Balance
  let totalBalance = 0
  wallets.forEach(w=>{
   totalBalance += w.balance
  })

  // 3️⃣ Total Spending
  const transactions = await Transaction.find({
   walletId:{$in:walletIds}
  })

  let totalSpent = 0
  transactions.forEach(t=>{
   totalSpent += t.amount
  })

  // 4️⃣ Category Spending
  const categoryMap = {}

  transactions.forEach(t=>{
   if(!categoryMap[t.category]){
    categoryMap[t.category] = 0
   }
   categoryMap[t.category] += t.amount
  })

  // 5️⃣ Recent Transactions
  const recentTransactions = await Transaction.find({
   walletId:{$in:walletIds}
  })
  .sort({createdAt:-1})
  .limit(5)

  res.json({
   totalWallets: wallets.length,
   totalBalance,
   totalSpent,
   categorySpending: categoryMap,
   recentTransactions
  })

 }catch(err){

  console.error(err)
  res.status(500).json({message:"Dashboard error"})

 }

}