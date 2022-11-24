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
  addComment,
  deleteComment,
  getComments,
  getVideoPosts,
} = require("../controllers/postControllers");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/").get(protect, getAllPosts).post(protect, createPost);
router.route("/reels").get(protect, getVideoPosts);
router.route("/:id").delete(protect, deletePost);
router.route("/like/:id").post(protect, likePost);
router.route("/post/:id").get(getPostData);
router.route("/related/:id").get(getRelatedPosts);
router.route("/following").get(protect, getFollowingPosts);
router.route("/random").get(protect, getRandomPosts);
router
  .route("/comment/:id")
  .post(protect, addComment)
  .get(protect, getComments);

router.route("/comment/:id/:comment_id").delete(protect, deleteComment);
module.exports = router;
