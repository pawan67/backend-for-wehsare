const Notification = require("../models/notificationModal");
const asyncHandler = require("express-async-handler");
const getNotificationsForUser = asyncHandler(async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id }).sort({
    createdAt: -1,
  });
  res.json(notifications);
});

module.exports = { getNotificationsForUser };
