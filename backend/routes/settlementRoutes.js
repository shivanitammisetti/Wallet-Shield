const express = require("express");

const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware");

const { getSettlement } = require("../controllers/settlementController");

router.get("/wallet/:walletId", authMiddleware, getSettlement);

module.exports = router;