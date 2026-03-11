const express = require("express")
const router = express.Router()

const { getCategorySpending } = require("../controllers/analyticsController")
const authMiddleware = require("../middleware/authMiddleware")

router.get("/category-spending", authMiddleware, getCategorySpending)

module.exports = router