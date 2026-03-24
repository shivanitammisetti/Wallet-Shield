exports.generateInsights = (transactions) => {

 let insights = []

 const total = transactions.reduce((sum, tx) => sum + tx.amount, 0)

 if (total > 5000) {
  insights.push("💸 High spending detected this month")
 }

 const foodTx = transactions.filter(tx => tx.category === "Food")

 if (foodTx.length > 5) {
  insights.push("🍔 Frequent food orders detected")
 }

 if (transactions.length > 15) {
  insights.push("📊 You are very active this month")
 }

 if (insights.length === 0) {
  insights.push("✅ Spending looks normal")
 }

 return insights
}




// exports.generateInsights = (transactions) => {

//  let insights = []

//  if(transactions.length > 20){
//   insights.push("📊 High transaction activity detected this month")
//  }

//  const large = transactions.filter(tx => tx.amount > 1000)

//  if(large.length > 0){
//   insights.push("💰 You made several high-value purchases recently")
//  }

//  if(insights.length === 0){
//   insights.push("✅ Spending patterns look normal")
//  }

//  return insights
// }