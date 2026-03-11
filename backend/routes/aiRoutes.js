const express = require("express")
const router = express.Router()

const { classifyExpenseAI } = require("../controllers/aiController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/classify-expense",authMiddleware,classifyExpenseAI)

module.exports = router