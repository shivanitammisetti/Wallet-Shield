const express = require("express");
const router = express.Router();

const upload = require("../middleware/upload");
const { scanReceipt } = require("../controllers/receiptController");
const authMiddleware = require("../middleware/authMiddleware");

// router.post("/scan", upload.single("receipt"), scanReceipt);
router.post(
  "/scan",
  authMiddleware,
  upload.single("receipt"),
  scanReceipt
);

module.exports = router;