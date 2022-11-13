const express = require("express");
const {
  registerUser,
  authUser,
  getUserProfile,
} = require("../controllers/userControllers");
const router = express.Router();

router.route("/").post(registerUser);
router.route("/login").post(authUser);
router.route("/:userName").get(getUserProfile);

module.exports = router;
