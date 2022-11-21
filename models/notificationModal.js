const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
  user: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  sender: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
  url: {
    type: String,
    default: "",
  },
  senderImage: {
    type: String,
    default: "https://i.imgur.com/QVk26ej.png",
  },
  message: {
    type: String,
    default: "",
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  type: {
    type: String,
    default: "",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const Notification = mongoose.model("Notification", notificationSchema);

module.exports = Notification;
