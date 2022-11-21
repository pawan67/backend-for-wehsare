const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const Post = require("../models/postModal");
const generateToken = require("../utils/generateToken");
const Notification = require("../models/notificationModal");
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, userName, password, pic } = req.body;

  const userExists = await User.findOne({ email });
  const usernameExists = await User.findOne({ userName });

  if (userExists) {
    res.status(400);
    throw new Error("User already exists");
  }
  if (usernameExists) {
    res.status(400);
    throw new Error("Username already exists");
  }

  const user = await User.create({
    name,
    email,
    password,
    pic,
    userName: userName,
  });

  if (user) {
    // create notification for new user
    const notification = await Notification.create({
      user: user._id,
      message: `Welcome to Weshare, ${user.name}!`,
      type: "welcome",
      sender: "6375a74570756a4b0cb98a97",
      url: "/profile/pawan67",
      senderImage: "https://i.imgur.com/TEMNv8X.png",
    });

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      isAdmin: user.isAdmin,
      pic: user.pic,
      token: generateToken(user._id),
      userName: user.userName,
      followers: user.followers,
      following: user.following,
      bio: user.bio,
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
        userName: user.userName,
        followers: user.followers,
        following: user.following,
        bio: user.bio,
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
        userName: user.userName,
        followers: user.followers,
        following: user.following,
        bio: user.bio,
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
      userName: user.userName,
      posts: posts,
      bio: user.bio,
    });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getRandomUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).sort({ followers: -1 });
  if (users) {
    res.json(users);
  } else {
    res.status(404);
    throw new Error("Users not found");
  }
});

const followUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  const userToFollow = await User.findById(req.params.id);
  if (user && userToFollow) {
    if (userToFollow._id == user._id) {
      res.status(400);
      throw new Error("You cannot follow yourself");
    }
    if (
      user.following.includes(req.params.id) &&
      userToFollow.followers.includes(req.user._id)
    ) {
      res.status(400);
      throw new Error("Already following");
    } else {
      // create notification
      const notification = await Notification.create({
        user: userToFollow._id,
        message: `${user.name} started following you`,
        type: "follow",
        sender: user._id,
        url: `/profile/${user.userName}`,
        senderImage: user.pic,
      });

      user.following.push(req.params.id);
      userToFollow.followers.push(req.user._id);
      await user.save();
      await userToFollow.save();
      res.json(user);
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const unfollowUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  const userToUnfollow = await User.findById(req.params.id);
  if (user && userToUnfollow) {
    if (
      user.following.includes(req.params.id) ||
      userToUnfollow.followers.includes(req.user._id)
    ) {
      const id = req.user._id.toString();
      userToUnfollow.followers = userToUnfollow.followers.filter(
        (item) => item != id
      );
      user.following = user.following.filter((item) => item != req.params.id);

      console.log(req.params.id);
      // convert to string

      console.log(id);
      await user.save();
      await userToUnfollow.save();
      res.json(userToUnfollow);
    } else {
      res.status(400);
      throw new Error("Not following");
    }
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const searchUsers = asyncHandler(async (req, res) => {
  let userPattern = new RegExp("^" + req.body.query);

  const users = await User.find({
    userName: { $regex: userPattern },
  });
  res.json({ users });
});

const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    await user.remove();
    res.json({ message: "User removed[...]" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const makeUserAdmin = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (user) {
    user.isAdmin = true;
    await user.save();
    res.json({ message: "User is now admin" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

const getInfoOfUserArrays = asyncHandler(async (req, res) => {
  // get details of ['id1', 'id2', 'id3']

  const arrayOfusers = req.body.users;
  console.log(arrayOfusers);
  const users = await User.find({ _id: { $in: arrayOfusers } });

  res.json(users);
});

const updateUserDetails = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;
    user.pic = req.body.pic || user.pic;
    user.userName = req.body.userName || user.userName;
    user.bio = req.body.bio || user.bio;
    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();

    res.json({ message: "User updated" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

module.exports = {
  registerUser,
  getUserProfile,
  authUser,
  getRandomUsers,
  followUser,
  unfollowUser,
  searchUsers,
  deleteUser,
  makeUserAdmin,
  getInfoOfUserArrays,
  updateUserDetails,
};
