const Post = require("../models/postModal");
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Notification = require("../models/notificationModal");
const getAllPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ user: req.user._id }).sort({ createdAt: -1 });
  res.json(posts);
});

const createPost = asyncHandler(async (req, res) => {
  const { caption, image, type } = req.body;

  const post = await Post.create({
    user: req.user._id,
    caption,
    image,
    userAvatar: req.user.pic,
    name: req.user.name,
    userName: req.user.userName,
    type,
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
      const notification = await Notification.create({
        user: post.user,
        message: `${req.user.name} liked your post`,
        type: "like",
        sender: req.user._id,
        url: `/p/${post._id}`,
        senderImage: req.user.pic,
      });
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

const getVideoPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find({ type: "video" }).sort({ createdAt: -1 });
  res.json(posts);
});

const getFollowingPosts = asyncHandler(async (req, res) => {
  let posts = await Post.find({
    user: { $in: req.user.following },
  }).sort({ createdAt: -1 });

  // randomize posts
  posts = posts.sort(() => Math.random() - 0.5);

  res.json(posts);
});

const getRandomPosts = asyncHandler(async (req, res) => {
  let posts = await Post.find({ user: { $ne: req.user._id } }).sort({
    createdAt: -1,
  });

  // randomize posts
  posts = posts.sort(() => Math.random() - 0.5);

  res.json(posts);
});

const addComment = asyncHandler(async (req, res) => {
  const { comment } = req.body;
  const post = await Post.findById(req.params.id);
  if (post) {
    const newComment = {
      comment,
      user: req.user._id,
      name: req.user.name,
      userName: req.user.userName,
      pic: req.user.pic,
    };

    const notification = await Notification.create({
      user: post.user,
      message: `${req.user.name} commented on your post`,
      type: "comment",
      sender: req.user._id,
      url: `/p/${post._id}?commentTrigger=true`,
      senderImage: req.user.pic,
    });

    post.comments.push(newComment);
    await post.save();
    res.json(post);
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

const deleteComment = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    const comment = post.comments.find(
      (comment) => comment._id.toString() === req.params.comment_id
    );
    if (comment) {
      await comment.remove();
      await post.save();
      res.json(post);
    } else {
      res.status(404);

      throw new Error("Comment not found");
    }
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

const getComments = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    res.json(post.comments);
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
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
  addComment,
  deleteComment,
  getVideoPosts,
  getComments,
};
