const express = require("express");
const {
  registerUser,
  authUser,
  getUserProfile,
  getRandomUsers,
  unfollowUser,
  followUser,
  searchUsers,
} = require("../controllers/userControllers");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/").post(registerUser);
router.route("/login").post(authUser);
router.route("/user/:userName").get(getUserProfile);
router.route("/random").get(getRandomUsers);
router.route("/follow/:id").put(protect, followUser);
router.route("/unfollow/:id").put(protect, unfollowUser);
router.route("/search").post(searchUsers);
module.exports = router;
