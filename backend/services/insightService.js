exports.generateInsights = (transactions) => {

 let insights = []

 if(transactions.length > 20){
  insights.push("📊 High transaction activity detected this month")
 }

 const large = transactions.filter(tx => tx.amount > 1000)

 if(large.length > 0){
  insights.push("💰 You made several high-value purchases recently")
 }

 if(insights.length === 0){
  insights.push("✅ Spending patterns look normal")
 }

 return insights
}