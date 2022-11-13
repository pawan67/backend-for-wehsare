const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Post = require("../models/postModal");
const generateToken = require("../utils/generateToken");

const registerUser = asyncHandler(async (req, res) => {
  const { name, email, username, password, pic } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
    userName: username,
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
      username: user.userName,
      followers: user.followers,
      following: user.following,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

const authUser = asyncHandler(async (req, res) => {
  const { email, username, password } = req.body;

  if (username) {
    const user = await User.findOne({ username });

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
        username: user.userName,
        followers: user.followers,
        following: user.following,
      });
    } else {
      // send error with message "Invalid email or password"
      res.status(401);
      throw new Error("Invalid email or password");
    }
  } else {
    const user = await User.findOne({ email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin,
        pic: user.pic,
        token: generateToken(user._id),
        username: user.userName,
        followers: user.followers,
        following: user.following,
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  }
});

const getUserProfile = asyncHandler(async (req, res) => {
  const userName = req.params.userName;
  const user = await User.findOne({ userName });
  const posts = await Post.find({ user: user._id }).sort({ createdAt: -1 });
  console.log(user);
  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      followers: user.followers,
      following: user.following,
      username: user.userName,
      posts: posts,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  registerUser,
  getUserProfile,
  authUser,
};
