const userModel = require("../src/models/userModel");
const bcrypt = require("bcrypt")
const sendOTPEmail = require("./")

const createUser = (req, res) => {
  res.render("index");
};

const signin = (req, res) => {
  res.render("signin");
};

const forget = (req, res) => {
  res.render("forget");
};

const resetPassword = async (req, res) => {
  const user = await userModel.findById(req.params.user);
  if (!user) return res.status(404).send("User does not exist");
  if (user.otpPurpose !== "reset_password")
    return res.status(403).send("Unauthorised");

  res.render("reset", { user });
};

const signout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};

const createUserr = async (req, res) => {
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

module.exports = {
  createUser,
  signin,
  forget,
  resetPassword,
  signout,
  createUserr,
};
