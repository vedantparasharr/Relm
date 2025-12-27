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
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);

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
