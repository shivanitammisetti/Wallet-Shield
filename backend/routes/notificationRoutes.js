const express = require("express")
const router = express.Router()
const { markAsRead } = require("../controllers/notificationController")

// router.put("/:id/read", authMiddleware, markAsRead)
const authMiddleware = require("../middleware/authMiddleware")

const {
  getNotifications,
  getNotificationCount
} = require("../controllers/notificationController")

router.get("/", authMiddleware, getNotifications)
router.get("/count", authMiddleware, getNotificationCount)
router.put("/:id/read", authMiddleware, markAsRead)

module.exports = router



// const express = require("express")
// const router = express.Router()

// const authMiddleware = require("../middleware/authMiddleware")
// const { getNotifications } = require("../controllers/notificationController")

// router.get("/count", authMiddleware, getNotificationCount)
// router.get("/", authMiddleware, getNotifications)

// module.exports = router