const Post = require("../models/postModal");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
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
    name: req.user.name,
    userName: req.user.userName,
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

const likePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    if (post.likes.includes(req.user._id)) {
      await post.likes.pull(req.user._id);
    } else {
      await post.likes.push(req.user._id);
    }
    await post.save();
    res.json(post);
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

const getPostData = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

const getRelatedPosts = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    const posts = await Post.find({
      _id: { $ne: post._id },
      user: post.user,
    }).sort({ createdAt: -1 });
    res.json(posts);
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

const getFollowingPosts = asyncHandler(async (req, res) => {
  // const currentUser = await User.findById(req.user._id);

  const posts = await Post.find({
    user: { $in: req.user.following },
  }).sort({ createdAt: -1 });
  res.json(posts);
});

const getRandomPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ user: { $ne: req.user._id } }).sort({
    createdAt: -1,
  });
  res.json(posts);
});

module.exports = {
  getAllPosts,
  createPost,
  deletePost,
  likePost,
  getPostData,
  getRelatedPosts,
  getFollowingPosts,
  getRandomPosts,
};
