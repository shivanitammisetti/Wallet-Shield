const express = require("express")
const router = express.Router()
const {addExpense,getTransactions,filterTransactions} = require("../controllers/transactionController")
const authMiddleware = require("../middleware/authMiddleware")
const { transferMoney } = require("../controllers/transactionController")


router.post("/transfer", authMiddleware, transferMoney)
router.post("/add",authMiddleware,addExpense)
router.get("/",authMiddleware,getTransactions)
router.get("/filter", authMiddleware, filterTransactions)

module.exports = router