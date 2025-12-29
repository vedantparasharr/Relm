// ======================
// Imports & Dependencies
// ======================
require("dotenv").config();

const path = require("path");

const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");

const express = require("express");
const cookieParser = require("cookie-parser");

const userModel = require("./models/userModel");
const postModel = require("./models/postModel");

// ======================
// App Initialization
// ======================
const app = express();

// ======================
// App Configuration
// ======================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const authRoutes = require("../routes/auth.routes");
const profileRoutes = require("../routes/profile.routes");
const postRoutes = require("../routes/post.routes");
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/posts", postRoutes);

const checkAuth = (req) => {
  const token = req.cookies.token;
  if (!token) return null;
  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

const verifyToken = require("./utils/verifyToken");

// ======================
// Public Routes
// ======================
app.get("/", (req, res) => {
  const user = checkAuth(req);
  if (user) return res.redirect("/home");

  return res.render("authRequired", {
    title: "Welcome to Relm",
    message: "Sign in, create an account, or continue as guest",
  });
});

app.get("/home", verifyToken, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId);
    const posts = await postModel
      .find()
      .sort({ createdAt: -1 })
      .populate("author", "username name image")
      .lean();
    res.render("home", { posts, user, dayjs });
  } catch (error) {
    res.status(500).send("Server Error");
  }
});

app.use((req, res) => {
  res.status(404).render("error");
});

module.exports = app;
