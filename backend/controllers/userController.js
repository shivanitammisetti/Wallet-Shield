const User = require("../models/User")

exports.setInitialBalance = async (req, res) => {
  try {
    const { balance } = req.body

    const user = await User.findById(req.user.id)

    user.balance = balance
    user.isProfileComplete = true   // ✅ IMPORTANT

    await user.save()

    res.json({
      message: "Profile setup completed ✅",
      balance: user.balance
    })

  } catch (err) {
    res.status(500).json(err)
  }
}

// exports.setInitialBalance = async (req, res) => {
//   try {
//     const { balance } = req.body

//     const user = await User.findById(req.user.id)

//     user.balance = balance
//     await user.save()

//     res.json({
//       message: "Profile setup completed ✅",
//       balance: user.balance
//     })

//   } catch (err) {
//     res.status(500).json(err)
//   }
// }