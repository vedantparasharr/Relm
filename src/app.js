// ======================
// Imports & Dependencies
// ======================
require("dotenv").config();

const path = require("path");
const crypto = require("crypto");

const dayjs = require("dayjs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const express = require("express");
const cookieParser = require("cookie-parser");

const upload = require("./config/multer");
const uploadToSupabase = require("./utils/uploadToSupabase");
const sendOTPEmail = require("./utils/sendOTPEmail");

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

// ======================
// Authentication Middleware
// ======================

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).render("authRequired", {
      title: "Sign in required!",
      message: "Please Sign in or continue as guest",
    });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (err) {
    res.clearCookie("token");
    return res.status(401).render("authRequired", {
      title: "Sign in required!",
      message: "Please Sign in or continue as guest",
    });
  }
};

// ======================
// Public Routes
// ======================
app.get("/", (req, res) => {
  res.render("index");
});

// ======================
// Authentication Routes
// ======================

app.post("/createUser", upload.single("image"), async (req, res) => {
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
  });

  if (!user.verified) {
    sendOTPEmail(user).catch(console.error);
    return res.render("verify", { user: user._id });
  }
});

app.post("/verify-email", async (req, res) => {
  const { userId, code } = req.body;

  const user = await userModel.findById(userId);
  if (!user) return res.status(404).send("User not found");

  if (!user.expireOTP || user.expireOTP < Date.now()) {
    return res.status(400).send("OTP Expired");
  }

  const isValid = await bcrypt.compare(code, user.hashOTP);
  if (!isValid) return res.status(400).send("Invalid OTP");

  user.verified = true;
  user.hashOTP = undefined;
  user.expireOTP = undefined;
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

  res.redirect("/profile");
});

app.get("/createguest", async (req, res) => {
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
});

app.get("/auth/signin", (req, res) => {
  res.render("signin");
});

app.post("/auth/signin", async (req, res) => {
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
});

app.get("/auth/signout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

// ======================
// Profile Routes
// ======================
app.get("/profile", verifyToken, async (req, res) => {
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
});

app.get("/profile/about", verifyToken, async (req, res) => {
  const user = await userModel.findById(req.user.userId);
  const posts = await postModel
    .find({ author: user._id })
    .populate("author")
    .populate("likes");

  if (!user) return res.status(404).send("User not found");
  res.render("about", { user, posts, dayjs });
});

app.get("/profile/edit", verifyToken, async (req, res) => {
  const user = await userModel.findById(req.user.userId);
  if (!user) return res.status(404).send("User not found");

  res.render("editProfile", { user, dayjs });
});

app.post(
  "/profile/edit",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
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
  }
);

// ======================
// Profile Settings Routes
// ======================
app.get("/profile/settings", verifyToken, async (req, res) => {
  const user = await userModel.findById(req.user.userId);
  if (!user) return res.status(404).send("User not found");

  res.render("settings", { user, dayjs });
});

app.post(
  "/profile/settings",
  verifyToken,
  upload.single("image"),
  async (req, res) => {
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
  }
);

// ======================
// Post Routes
// ======================
app.get("/posts/new", verifyToken, async (req, res) => {
  const user = await userModel.findById(req.user.userId);
  res.render("createPost", { user });
});

app.post("/posts", verifyToken, async (req, res) => {
  const { title, content } = req.body;
  const user = await userModel.findById(req.user.userId);

  try {
    const newPost = await postModel.create({
      author: user._id,
      title: title.trim(),
      content: content.trim(),
    });
    await userModel.findByIdAndUpdate(user._id, {
      $push: { posts: newPost._id },
    });

    res.redirect("/profile");
  } catch (error) {
    res.status(500).send("Error creating post");
  }
});

app.get("/posts/:id", verifyToken, async (req, res) => {
  const post = await postModel
    .findById(req.params.id)
    .populate("author")
    .populate("likes")
    .populate("comments.author");

  const user = await userModel.findById(req.user.userId);
  res.render("postDetail", { post, user, dayjs });
});

app.post("/posts/:id/comments", verifyToken, async (req, res) => {
  const { content } = req.body;
  const post = await postModel.findById(req.params.id);

  post.comments.push({
    author: req.user.userId,
    content,
  });
  await post.save();
  res.redirect(`/posts/${post._id}`);
});

app.get(
  "/posts/:postId/comments/:commentId/delete",
  verifyToken,
  async (req, res) => {
    try {
      const { postId, commentId } = req.params;
      const post = await postModel.findById(postId);
      if (!post) return res.status(404).send("Post not found");
      const comment = post.comments.id(commentId);
      if (!comment) return res.status(404).send("Comment not found");
      if (comment.author.toString() !== req.user.userId.toString())
        return res.status(404).send("Not authorised");
      post.comments.pull(commentId);
      await post.save();
      res.redirect(`/posts/${postId}`);
    } catch (error) {
      console.error(error);
      res.status(500).send("Server error");
    }
  }
);

app.get("/posts/:id/edit", verifyToken, async (req, res) => {
  const post = await postModel.findById(req.params.id);
  const user = await userModel.findById(req.user.userId);

  if (!post) return res.status(404).send("Post not found");
  if (post.author.toString() !== req.user.userId)
    return res.status(403).send("Unauthorized");

  res.render("editPost", { post, user });
});

app.post("/posts/:id/edit", verifyToken, async (req, res) => {
  const { title, content } = req.body;
  const post = await postModel.findById(req.params.id);
  if (!post) return res.status(404).send("Post not found");
  if (post.author.toString() !== req.user.userId) {
    return res.status(403).send("Unauthorized");
  }
  await postModel.findByIdAndUpdate(req.params.id, {
    title: title.trim(),
    content: content.trim(),
  });

  res.redirect(`/posts/${req.params.id}`);
});

app.get("/posts/:id/delete", verifyToken, async (req, res) => {
  const post = await postModel.findById(req.params.id);

  if (!post) return res.status(404).send("Post not found");
  if (post.author.toString() !== req.user.userId)
    return res.status(403).send("Unauthorized");

  await postModel.findByIdAndDelete(req.params.id);
  await userModel.findByIdAndUpdate(req.user.userId, {
    $pull: { posts: req.params.id },
  });
  res.redirect("/profile");
});

app.post("/posts/:id/like", verifyToken, async (req, res) => {
  const post = await postModel.findById(req.params.id);
  const userId = req.user.userId;
  if (!post) return res.status(403).send("Post not found!");

  const hasLiked = post.likes.some((u) => u.toString() === userId.toString());
  if (hasLiked) {
    await postModel.findByIdAndUpdate(post._id, {
      $pull: { likes: userId },
    });
  } else {
    await postModel.findByIdAndUpdate(post._id, {
      $addToSet: { likes: userId },
    });
  }

  const updatedPost = await postModel.findById(post._id);

  res.json({
    liked: !hasLiked,
    likesCount: updatedPost.likes.length,
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
