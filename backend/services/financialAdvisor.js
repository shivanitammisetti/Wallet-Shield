exports.generateAdvice = (transactions) => {

 let advice = []

 let categoryMap = {}

 transactions.forEach(tx=>{

  if(!categoryMap[tx.category]){
   categoryMap[tx.category] = 0
  }

  categoryMap[tx.category] += tx.amount

 })

 const total = Object.values(categoryMap)
  .reduce((sum,val)=>sum+val,0)

 for(const category in categoryMap){

  const percent = (categoryMap[category]/total)*100

  if(percent > 40){

   advice.push(
    `⚠ ${category} spending is ${percent.toFixed(0)}% of total. Try reducing it.`
   )

  }

 }

 if(categoryMap["Entertainment"] > 1000){
  advice.push("🎬 Entertainment spending seems high this month.")
 }

 if(total > 5000){
  advice.push("💰 Consider setting a savings goal.")
 }

 if(advice.length === 0){
  advice.push("✅ Your spending looks balanced.")
 }

 return advice

}