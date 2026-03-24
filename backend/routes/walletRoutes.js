const express = require("express")
const router = express.Router()

const authMiddleware = require("../middleware/authMiddleware")

// ✅ Import ALL controllers in ONE place (no duplicates)
const {
  createWallet,
  getWallets,
  addMembers,
  getMemberCount,
  addMoney
} = require("../controllers/walletController")

// ✅ Add money
router.post("/add-money", authMiddleware, addMoney)

// ✅ Create wallet
router.post("/", authMiddleware, createWallet)

// ✅ Get all wallets
router.get("/", authMiddleware, getWallets)

// ✅ Add members (group wallet)
router.post("/add-members", authMiddleware, addMembers)

// ✅ Member count
router.get("/members/:walletId", authMiddleware, getMemberCount)

module.exports = router


// const express = require("express")
// const router = express.Router()

// const {
//   createWallet,
//   getWallets,
//   getMemberCount,
//   addMembers
// } = require("../controllers/walletController")

// const authMiddleware = require("../middleware/authMiddleware")

// router.post("/create", authMiddleware, createWallet)

// router.get("/", authMiddleware, getWallets)

// router.get("/member-count/:walletId", authMiddleware, getMemberCount)

// // NEW ROUTE
// router.put("/add-member", authMiddleware, addMembers)

// module.exports = router



// const express = require("express")
// const router = express.Router()
// const {createWallet,getWallets,getMemberCount} = require("../controllers/walletController")
// const authMiddleware = require("../middleware/authMiddleware")

// router.post("/create",authMiddleware,createWallet)
// router.get("/",authMiddleware,getWallets)

// router.get("/member-count/:walletId", authMiddleware, getMemberCount)

// module.exports = router