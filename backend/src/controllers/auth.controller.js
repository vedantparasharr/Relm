// ======================
// Third-Party & Core Imports
// ======================
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto"); // required for guest login

// ======================
// Database Models
// ======================
const userModel = require("../models/userModel");

// ======================
// Utilities
// ======================
const sendOTPEmail = require("../utils/sendOTPEmail");
const uploadToSupabase = require("../utils/uploadToSupabase");

// ======================
// Render Pages
// ======================
const renderReset = async (req, res) => {
  const user = await userModel.findById(req.params.user);
  if (!user) return res.status(404).send("User does not exist");
  if (user.otpPurpose !== "reset_password")
    return res.status(403).send("Unauthorised");

  res.render("reset", { user });
};

// ======================
// Handle Signout dsds
// ======================
const handleSignout = (req, res) => {
  const isProd = process.env.NODE_ENV === "production";

  res.clearCookie("token", {
    httpOnly: true,
    secure: true,
    sameSite: "none",
  });

  res.status(200).json({ message: "Logged out" });
};

// ======================
// Handle Signup
// ======================
const handleSignup = async (req, res) => {
  const { username, name, email, password, dateOfBirth } = req.body;
  const normalizedUsername = username.trim().toLowerCase();

  const isUser = await userModel.findOne({
    $or: [{ email }, { username: normalizedUsername }],
  });

  if (isUser) return res.status(400).send("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const imageUrl = req.file ? await uploadToSupabase(req.file) : undefined;

  const user = await userModel.create({
    username: normalizedUsername,
    name,
    email,
    password: hashedPassword,
    dateOfBirth,
    image: imageUrl,
    otpPurpose: "verify_email",
  });

  // Trigger email verification
  if (!user.verified) {
    sendOTPEmail(user).catch(console.error);
    return res.status(201).json({ next: "verify", userId: user._id });
  }
};

// ======================
// Handle Email / OTP Verification
// ======================
const handleVerifyEmail = async (req, res) => {
  const { userId, code } = req.body;
  const user = await userModel.findById(userId);

  if (!user) return res.status(404).send("User not found");

  if (!user.otpExpires || user.otpExpires < Date.now()) {
    return res.status(400).send("OTP Expired");
  }

  const isValid = await bcrypt.compare(code, user.otpHash);
  if (!isValid) return res.status(400).send("Invalid OTP");

  user.otpHash = undefined;
  user.otpExpires = undefined;

  // Email verification flow
  if (user.otpPurpose === "verify_email") {
    user.verified = true;
    user.otpPurpose = undefined;
    await user.save();

    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" },
    );

    const isProd = process.env.NODE_ENV === "production";

    res.cookie("token", token, {
      httpOnly: true,
      secure: true, // required for SameSite=None
      sameSite: "None", // required for cross-origin cookies
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res
      .status(200)
      .json({ message: "Verification successful", next: "home" });
  }

  // Password reset flow
  if (user.otpPurpose === "reset_password") {
    await user.save();
    return res.redirect(`/auth/reset-password/${user._id}`);
  }

  res.status(400).send("Invalid OTP request");
};

// ======================
// Handle Guest Login
// ======================
const handleGuest = async (req, res) => {
  const randomId = crypto.randomUUID();

  const token = jwt.sign({ data: randomId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // required for SameSite=None
    sameSite: "None", // required for cross-origin cookies
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.redirect("/home");
};

// ======================
// Handle Signin
// ======================
const handleSignin = async (req, res) => {
  const { email, password, remember } = req.body;

  const user = await userModel.findOne({ email });
  if (!user)
    return res.status(400).json({ message: "Invalid email or password" });

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(400).json({ message: "Invalid email or password" });

  if (!user.verified) {
    sendOTPEmail(user).catch(console.error);
    return res.json({ next: "verify", user: user._id });
  }

  const expiresIn = remember ? "30d" : "1d";
  const maxAge = remember ? 30 * 24 * 60 * 60 * 1000 : 24 * 60 * 60 * 1000;

  const token = jwt.sign(
    { email: email, userId: user._id },
    process.env.JWT_SECRET,
    { expiresIn },
  );

  const isProd = process.env.NODE_ENV === "production";

  res.cookie("token", token, {
    httpOnly: true,
    secure: true, // required for SameSite=None
    sameSite: "None", // required for cross-origin cookies
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.json();
};

// ======================
// Handle Forgot Password
// ======================
const handleForget = async (req, res) => {
  const { email } = req.body;
  const user = await userModel.findOne({ email });

  if (!user) {
    return res.status(400).send("No account found with this email");
  }

  sendOTPEmail(user).catch(console.error);
  user.otpPurpose = "reset_password";
  user.otpHash = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.render("verify", { user: user._id });
};

// ======================
// Handle Password Reset
// ======================
const handleReset = async (req, res) => {
  const user = await userModel.findById(req.params.user);
  const { password, confirmPassword } = req.body;

  if (!user) return res.status(400).send("User does not exist.");
  if (password !== confirmPassword)
    return res.status(400).send("Passwords does not match");

  user.password = await bcrypt.hash(password, 10);
  user.otpPurpose = undefined;
  user.otpHash = undefined;
  user.otpExpires = undefined;
  await user.save();

  res.redirect("/auth/signin");
};

// ======================
// Exports
// ======================
module.exports = {
  renderSignup,
  renderSignin,
  renderForget,
  renderReset,
  handleSignout,
  handleSignup,
  handleVerifyEmail,
  handleGuest,
  handleSignin,
  handleForget,
  handleReset,
};
