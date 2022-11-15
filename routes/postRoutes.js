const express = require("express");
const {
  getAllPosts,
  createPost,
  deletePost,
  likePost,
  getRelatedPosts,
  getPostData,
  getFollowingPosts,
  getRandomPosts,
} = require("../controllers/postControllers");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/").get(protect, getAllPosts).post(protect, createPost);
router.route("/:id").delete(protect, deletePost);
router.route("/like/:id").post(protect, likePost);
router.route("/post/:id").get(getPostData);
router.route("/related/:id").get(getRelatedPosts);
router.route("/following").get(protect, getFollowingPosts);
router.route("/random").get(protect, getRandomPosts);

module.exports = router;
