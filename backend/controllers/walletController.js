const Wallet = require("../models/Wallet")

exports.createWallet = async (req, res) => {

 try {

  const { name, owner, members } = req.body

//   const wallet = new Wallet({
//    name,
//    owner,
//    members: [...new Set([owner, ...(members || [])])]
//   })

    const wallet = new Wallet({
    name,
    owner: req.user.id,
    members: [...new Set([req.user.id, ...(members || [])])]
})
//     const wallet = new Wallet({
//     name,
//     owner: req.user.id,
//     members: [req.user.id, ...members]
// })

  await wallet.save()

  res.json(wallet)

 } catch (err) {
  res.status(500).json(err)
 }

}

exports.getWallets = async(req,res)=>{

 try{

  // const wallets = await Wallet.find().populate("members","name email")
  const wallets = await Wallet.find({
    members: req.user.id
}).populate("members","name email")

  res.json(wallets)

 }catch(err){
  res.status(500).json(err)
 }

}

exports.getMemberCount = async (req, res) => {
  try {
    const { walletId } = req.params

    const wallet = await Wallet.findById(walletId)

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" })
    }

    res.json({
      walletId: wallet._id,
      memberCount: wallet.members.length
    })

  } catch (err) {
    res.status(500).json(err)
  }
}

exports.addMembers = async (req, res) => {
  try {

    const { walletId, members } = req.body

    const wallet = await Wallet.findById(walletId)

    if (!wallet) {
      return res.status(404).json({ message: "Wallet not found" })
    }

    // merge existing + new members without duplicates
    wallet.members = [...new Set([...wallet.members, ...members])]

    await wallet.save()

    res.json({
      message: "Members added successfully",
      wallet
    })

  } catch (error) {

    console.error(error)

    res.status(500).json({
      message: "Failed to add members"
    })

  }
}