// ======================
// Core & Third-Party Imports
// ======================
const dayjs = require("dayjs");
const bcrypt = require("bcrypt");

// ======================
// Database Models
// ======================
const userModel = require("../models/userModel");
const postModel = require("../models/postModel");

// ======================
// Utilities
// ======================
const uploadToSupabase = require("../utils/uploadToSupabase");

// ======================
// Render Profile Page
// ======================
const renderProfile = async (req, res) => {
  // Guest users cannot access profile
  if (!req.user.userId) {
    return res.render("authRequired", {
      title: "Profile Unavailable",
      message: "Guest accounts do not have profiles. Sign in to continue.",
    });
  }

  const user = await userModel.findById(req.user.userId);
  if (!user) {
    return res.redirect("/auth/signin");
  }

  const posts = await postModel
    .find({ author: user._id })
    .populate("author")
    .populate("likes");

  res.json({ user, posts });
};

// ======================
// Render About Page
// ======================
const renderAbout = async (req, res) => {
  const user = await userModel.findById(req.user.userId);
  if (!user) return res.status(404).send("User not found");

  const posts = await postModel
    .find({ author: user._id })
    .populate("author")
    .populate("likes");

  res.json({ user, posts });
};

// ======================
// Render Edit Profile Page
// ======================
const renderEdit = async (req, res) => {
  const user = await userModel.findById(req.user.userId);
  if (!user) return res.status(404).send("User not found");

  res.render("editProfile", { user, dayjs });
};

// ======================
// Render Settings Page
// ======================
const renderSettings = async (req, res) => {
  const user = await userModel.findById(req.user.userId);
  if (!user) return res.status(404).send("User not found");

  res.render("settings", { user, dayjs });
};

// ======================
// Handle Profile Edit
// ======================
const handleEdit = async (req, res) => {
  const { name, username, bio } = req.body;

  const user = await userModel.findById(req.user.userId);
  if (!user) return res.status(404).send("User not found");

  const existingUser = await userModel.findOne({
    username: username.trim().toLowerCase(),
    _id: { $ne: req.user.userId },
  });

  if (existingUser) {
    return res.status(400).send("Username already taken");
  }

  const imageUrl = req.file ? await uploadToSupabase(req.file) : undefined;

  user.name = name?.trim();
  user.username = username.trim().toLowerCase();
  user.bio = bio?.trim();
  if (req.file) user.image = imageUrl;

  await user.save();
  res.redirect("/profile");
};

// ======================
// Handle Settings Update
// ======================
const handleSettings = async (req, res) => {
  const {
    name,
    username,
    bio,
    dateOfBirth,
    currentPassword,
    newPassword,
    confirmPassword,
  } = req.body;

  const user = await userModel.findById(req.user.userId);
  if (!user) return res.status(404).json("User not found");

  const isUserChangingPassword =
    currentPassword && newPassword && confirmPassword;

  if (currentPassword || newPassword || confirmPassword) {
    if (!isUserChangingPassword)
      return res.status(400).json({ message: "All passwords are required" });
  }

  if (isUserChangingPassword) {
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password,
    );

    if (!isPasswordValid)
      return res.status(400).json({ message: "Current password is incorrect" });

    if (newPassword !== confirmPassword)
      return res.status(400).json({ message: "New passwords do not match" });

    user.password = await bcrypt.hash(newPassword, 10);
  }

  const imageUrl = req.file ? await uploadToSupabase(req.file) : undefined;

  if (name) user.name = name;
  if (username) user.username = username.trim().toLowerCase();
  if (bio !== undefined) user.bio = bio;
  if (dateOfBirth) user.dateOfBirth = dateOfBirth;
  if (req.file) user.image = imageUrl;

  await user.save();
  res.json({
    message: "Profile updated successfully",
    user: {
      name: user.name,
      username: user.username,
      bio: user.bio,
      image: user.image,
    },
  });
};

// ======================
// Exports
// ======================
module.exports = {
  renderProfile,
  renderAbout,
  renderEdit,
  renderSettings,
  handleEdit,
  handleSettings,
};
