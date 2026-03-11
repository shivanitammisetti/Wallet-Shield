const express = require("express")
const router = express.Router()

const {
  createWallet,
  getWallets,
  getMemberCount,
  addMembers
} = require("../controllers/walletController")

const authMiddleware = require("../middleware/authMiddleware")

router.post("/create", authMiddleware, createWallet)

router.get("/", authMiddleware, getWallets)

router.get("/member-count/:walletId", authMiddleware, getMemberCount)

// NEW ROUTE
router.put("/add-member", authMiddleware, addMembers)

module.exports = router



// const express = require("express")
// const router = express.Router()
// const {createWallet,getWallets,getMemberCount} = require("../controllers/walletController")
// const authMiddleware = require("../middleware/authMiddleware")

// router.post("/create",authMiddleware,createWallet)
// router.get("/",authMiddleware,getWallets)

// router.get("/member-count/:walletId", authMiddleware, getMemberCount)

// module.exports = router