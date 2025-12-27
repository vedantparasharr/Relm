const path = require("path");
const crypto = require("crypto");

const dayjs = require("dayjs");
const bcrypt = require("bcrypt");

const express = require("express");
const cookieParser = require("cookie-parser");

const uploadToSupabase = require("../src/utils/uploadToSupabase");
const userModel = require("../src/models/userModel");
const postModel = require("../src/models/postModel");

const renderProfile = async (req, res) => {
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

const renderAbout = async (req, res) => {
  const user = await userModel.findById(req.user.userId);
  const posts = await postModel
    .find({ author: user._id })
    .populate("author")
    .populate("likes");

  if (!user) return res.status(404).send("User not found");
  res.render("about", { user, posts, dayjs });
};

const renderEdit = async (req, res) => {
  const user = await userModel.findById(req.user.userId);
  if (!user) return res.status(404).send("User not found");

  res.render("editProfile", { user, dayjs });
};

const renderSettings = async (req, res) => {
  const user = await userModel.findById(req.user.userId);
  if (!user) return res.status(404).send("User not found");

  res.render("settings", { user, dayjs });
};

const handleEdit = async (req, res) => {
  const { name, username, bio } = req.body;
  const user = await userModel.findById(req.user.userId);
  const existingUser = await userModel.findOne({
    username: username.trim().toLowerCase(),
    _id: { $ne: req.user.userId },
  });

  if (existingUser) {
    return res.status(400).send("Username already taken");
  }

  if (!user) return res.status(404).send("User not found");
  const imageUrl = req.file ? await uploadToSupabase(req.file) : undefined;

  user.name = name?.trim();
  user.username = username.trim().toLowerCase();
  user.bio = bio?.trim();
  if (req.file) user.image = imageUrl;
  await user.save();

  res.redirect("/profile");
};

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
  if (req.file) {
    user.image = imageUrl;
  }
  await user.save();
  res.redirect("/profile");
};

module.exports = {
  renderProfile,
  renderAbout,
  renderEdit,
  renderSettings,
  handleEdit,
  handleSettings,
};
