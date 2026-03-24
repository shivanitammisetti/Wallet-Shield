const Notification = require("../models/Notification")

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification
      .find({ userId: req.user.id })
      .sort({ createdAt: -1 })

    res.json(notifications)

  } catch (err) {
    res.status(500).json(err)
  }
}


exports.getNotificationCount = async (req, res) => {
  try {
    const count = await Notification.countDocuments({
      userId: req.user.id,
      isRead: false
    })

    res.json({ count })

  } catch (err) {
    res.status(500).json(err)
  }
}
// exports.getNotificationCount = async (req, res) => {
//   try {
//     const count = await Notification.countDocuments({
//       userId: req.user.id
//     });

//     res.json({ count });

//   } catch (err) {
//     res.status(500).json(err);
//   }
// };


exports.markAsRead = async (req, res) => {
  try {

    const { id } = req.params

    await Notification.findByIdAndUpdate(id, {
      isRead: true
    })

    res.json({ message: "Notification marked as read" })

  } catch (err) {
    res.status(500).json(err)
  }
}