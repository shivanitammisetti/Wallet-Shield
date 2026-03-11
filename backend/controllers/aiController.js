const { classifyExpense } = require("../services/aiService")

exports.classifyExpenseAI = async (req,res)=>{
 try{

  const {description} = req.body

  if(!description){
   return res.status(400).json({message:"Description required"})
  }

  const category = await classifyExpense(description)

  res.json({
   description,
   category
  })

 }catch(error){
  res.status(500).json({message:error.message})
 }
}