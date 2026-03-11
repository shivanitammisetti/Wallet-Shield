const express = require("express")
const router = express.Router()

const { setLimit } = require("../controllers/limitController")
const authMiddleware = require("../middleware/authMiddleware")

router.post("/set", authMiddleware, setLimit)

module.exports = router