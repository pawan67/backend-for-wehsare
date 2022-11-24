const Notification = require("../models/notificationModal");
const asyncHandler = require("express-async-handler");
const getNotificationsForUser = asyncHandler(async (req, res) => {
  let notifications = await Notification.find({ user: req.user._id }).sort({
    createdAt: -1,
  });

  notifications = notifications.slice(0, 20);

  res.json(notifications);
});

module.exports = { getNotificationsForUser };
