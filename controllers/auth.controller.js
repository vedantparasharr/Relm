const userModel = require("../src/models/userModel");
const bcrypt = require("bcrypt");
const sendOTPEmail = require("../src/utils/sendOTPEmail");
const uploadToSupabase = require("../src/utils/uploadToSupabase");
const jwt = require("jsonwebtoken");

const renderSignup = (req, res) => {
  res.render("index");
};

const renderSignin = (req, res) => {
  res.render("signin");
};

const renderForget = (req, res) => {
  res.render("forget");
};

const renderReset = async (req, res) => {
  const user = await userModel.findById(req.params.user);
  if (!user) return res.status(404).send("User does not exist");
  if (user.otpPurpose !== "reset_password")
    return res.status(403).send("Unauthorised");

  res.render("reset", { user });
};

const handleSignout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};

const handleSignup = async (req, res) => {
  const { username, name, email, password, dateOfBirth } = req.body;
  const normalizedUsername = username.trim().toLowerCase();
  let isUser = await userModel.findOne({
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

  if (!user.verified) {
    sendOTPEmail(user).catch(console.error);
    return res.render("verify", { user: user._id });
  }
};

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

  if (user.otpPurpose === "verify_email") {
    user.verified = true;
    user.otpPurpose = undefined;
    await user.save();

    const token = jwt.sign(
      { email: user.email, userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "30d" }
    );

    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
    res.redirect("/home");
  }

  if (user.otpPurpose === "reset_password") {
    await user.save();
    return res.redirect(`/auth/reset-password/${user._id}`);
  }
  res.status(400).send("Invalid OTP request");
};

const handleGuest = async (req, res) => {
  const randomId = crypto.randomUUID();
  const token = jwt.sign(
    {
      data: randomId,
    },
    process.env.JWT_SECRET,
    { expiresIn: "1h" }
  );
  res.cookie("token", token, {
    httpOnly: true,
    maxAge: 60 * 60 * 1000,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
  });
  res.redirect("/home");
};

const handleSignin = async (req, res) => {
  const { email, password, remember } = req.body;

  const user = await userModel.findOne({ email: email });
  if (!user) return res.status(400).send("Invalid email or password");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(400).send("Invalid email or password");

  if (!user.verified) {
    sendOTPEmail(user).catch(console.error);
    return res.render("verify", { user: user._id });
  }

  let token;
  if (remember) {
    token = jwt.sign(
      { email: email, userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "30d",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 30 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  } else {
    token = jwt.sign(
      { email: email, userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 1 * 24 * 60 * 60 * 1000,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
    });
  }
  res.redirect("/profile");
};

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

  return res.redirect("/auth/signin");
};

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
