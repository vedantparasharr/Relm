// ======================
// Environment & Core Setup
// ======================
require("dotenv").config();

const path = require("path");
const express = require("express");
const cookieParser = require("cookie-parser");

// ======================
// Third-Party Utilities
// ======================
const dayjs = require("dayjs");
const jwt = require("jsonwebtoken");

// ======================
// Database Models
// ======================
const userModel = require("./models/userModel");
const postModel = require("./models/postModel");

// ======================
// App Initialization
// ======================
const app = express();
const cors = require("cors");

app.use(
  cors({
    origin: ["http://localhost:5173", "https://relmsocial.vercel.app"],
    credentials: true,
  }),
);

// ======================
// View Engine Configuration
// ======================
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// ======================
// Global Middleware
// ======================
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ======================
// Route Modules
// ======================
const authRoutes = require("../src/routes/auth.routes");
const profileRoutes = require("../src/routes/profile.routes");
const postRoutes = require("../src/routes/post.routes");

// ======================
// Route Mounting
// ======================
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/posts", postRoutes);

// ======================
// Helper: Optional Auth Check
// Used for routes where login is optional
// ======================
const checkAuth = (req) => {
  const token = req.cookies.token;
  if (!token) return null;

  try {
    return jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    return null;
  }
};

// ======================
// Auth Middleware (Strict)
// ======================
const verifyToken = require("./utils/verifyToken");

// ======================
// Routes
// ======================

// Landing page
app.get("/", (req, res) => {
  const user = checkAuth(req);
  if (user) return res.redirect("/home");

  return res.render("authRequired", {
    title: "Welcome to Relm",
    message: "Sign in, create an account, or continue as guest",
  });
});

// Home feed (Protected)
app.get("/home", verifyToken, async (req, res) => {
  try {
    const user = await userModel.findById(req.user.userId);

    const posts = await postModel
      .find()
      .sort({ createdAt: -1 })
      .populate("author", "username name image")
      .lean();

    res.json({ posts });
  } catch (error) {
    res.status(500).json("Server Error");
  }
});

// ======================
// 404 Handler
// ======================
app.use((req, res) => {
  res.status(404).render("error");
});

module.exports = app;
