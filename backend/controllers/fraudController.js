const FraudAlert = require("../models/FraudAlert")

exports.getFraudAlerts = async (req,res)=>{
 try{

  const alerts = await FraudAlert
   .find({userId:req.user.id})
   .sort({createdAt:-1})

  res.json({
   count:alerts.length,
   alerts
  })

 }catch(error){
  res.status(500).json({message:error.message})
 }
}