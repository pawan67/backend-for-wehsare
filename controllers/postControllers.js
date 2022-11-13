const Post = require("../models/postModal");
const asyncHandler = require("express-async-handler");

const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(posts);
});

const createPost = asyncHandler(async (req, res) => {
  const { caption, image } = req.body;
  
  const post = await Post.create({
    user: req.user._id,
    caption,
    image,
    userAvatar: req.user.pic,
    userName: req.user.name,
  });
  res.json(post);
});

const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    await post.remove();
    res.json({ message: "Post removed" });
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

module.exports = {
  getAllPosts,
  createPost,
  deletePost,
};
