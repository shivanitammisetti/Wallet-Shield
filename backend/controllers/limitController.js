const CategoryLimit = require("../models/CategoryLimit")

exports.setLimit = async (req, res) => {

 try {

  const { category, limitAmount } = req.body
  const userId = req.user.id

  const limit = new CategoryLimit({
   userId,
   category,
   limitAmount
  })

  await limit.save()

  res.json({
   message: "Category limit set successfully",
   limit
  })

 } catch (err) {
  res.status(500).json(err)
 }

}