// ======================
// Core & Third-Party Imports
// ======================
const dayjs = require("dayjs");
const bcrypt = require("bcrypt");

// ======================
// Database Models
// ======================
const userModel = require("../src/models/userModel");
const postModel = require("../src/models/postModel");

// ======================
// Utilities
// ======================
const uploadToSupabase = require("../src/utils/uploadToSupabase");

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

  res.render("profile", { user, posts, dayjs });
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

  res.render("about", { user, posts, dayjs });
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
    dateOfBirth,
    website,
    bio,
    currentPassword,
    newPassword,
    confirmPassword,
  } = req.body;

  const user = await userModel.findById(req.user.userId);
  if (!user) return res.status(404).send("User not found");

  // Check if password update is requested
  const isUserChangingPassword =
    currentPassword || newPassword || confirmPassword;

  if (isUserChangingPassword) {
    const isPasswordValid = await bcrypt.compare(
      currentPassword,
      user.password
    );

    if (!isPasswordValid)
      return res.status(400).send("Current password is incorrect");

    if (newPassword !== confirmPassword)
      return res.status(400).send("New passwords do not match");

    user.password = await bcrypt.hash(newPassword, 10);
  }

  const imageUrl = req.file ? await uploadToSupabase(req.file) : undefined;

  user.name = name;
  user.username = username.trim().toLowerCase();
  user.dateOfBirth = dateOfBirth;
  user.website = website;
  user.bio = bio;
  if (req.file) user.image = imageUrl;

  await user.save();
  res.redirect("/profile");
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
