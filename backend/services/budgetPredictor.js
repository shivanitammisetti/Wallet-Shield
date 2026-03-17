exports.predictMonthlySpend = (transactions) => {

 if(transactions.length === 0){
  return "Not enough data for prediction"
 }

 let total = 0

 transactions.forEach(tx=>{
  total += tx.amount
 })

 const daysPassed = new Date().getDate()

 const dailyAverage = total / daysPassed

 const predictedMonthSpend = Math.round(dailyAverage * 30)

 return `📊 At your current spending rate, you may spend ₹${predictedMonthSpend} this month`

}