const express = require("express")
const router = express.Router()

const {getFraudAlerts} = require("../controllers/fraudController")
const authMiddleware = require("../middleware/authMiddleware")

router.get("/alerts",authMiddleware,getFraudAlerts)

module.exports = router