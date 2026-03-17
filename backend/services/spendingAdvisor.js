exports.getSuggestions = (categorySpending) => {

 let suggestions = []

 const total = Object.values(categorySpending)
   .reduce((sum,val)=>sum+val,0)

 for(const category in categorySpending){

   const percent = (categorySpending[category] / total) * 100

   if(percent > 40){

    suggestions.push(
     `⚠ You are spending too much on ${category}. Try reducing it.`
    )

   }

   if(category === "Food" && percent > 30){
    suggestions.push(
     "🍔 High food spending detected. Consider cooking more at home."
    )
   }

 }

 if(suggestions.length === 0){
   suggestions.push("✅ Your spending looks balanced.")
 }

 return suggestions
}