const express = require("express")
const router = express.Router()

const authMiddleware = require("../middleware/authMiddleware")
const { setInitialBalance } = require("../controllers/userController")

router.post("/setup-profile", authMiddleware, setInitialBalance)

module.exports = router