const express = require("express");
const {
  getAllPosts,
  createPost,
  deletePost,
  likePost,
  getRelatedPosts,
  getPostData,
} = require("../controllers/postControllers");
const { protect } = require("../middlewares/authMiddleware");
const router = express.Router();

router.route("/").get(protect, getAllPosts).post(protect, createPost);
router.route("/:id").delete(protect, deletePost);
router.route("/like/:id").post(protect, likePost);
router.route("/post/:id").get(getPostData);
router.route("/relatedPosts/:id").get(getRelatedPosts);

module.exports = router;
