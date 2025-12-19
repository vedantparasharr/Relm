// ======================
// Imports & Dependencies
// ======================
require("dotenv").config();

const dayjs = require("dayjs");
const crypto = require("crypto");
const path = require("path");
const fs = require("fs");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const uploadToSupabase = require("./utils/uploadToSupabase");

const userModel = require("./models/userModel");
const postModel = require("./models/postModel");
const upload = require("./configs/multer");

const express = require("express");
const cookieParser = require("cookie-parser");
const { randomUUID } = require("crypto");

// ======================
// App Initialization
// ======================
const app = express();
const port = process.env.PORT || 3000;

// ======================
// App Configuration
// ======================
app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

// ======================
// Authentication Middleware
// ======================
const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token)
    return res.status(401).render("authRequired", {
      title: "Sign in required!",
      message: "Please Sign in or continue as guest",
    });
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
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
  const lowerUsername = username.toLowerCase();
  let isUser = await userModel.findOne({
    $or: [{ email }, { username: lowerUsername }],
  });
  if (isUser) return res.status(400).send("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const imageUrl = req.file ? await uploadToSupabase(req.file) : undefined;

  const newUser = await userModel.create({
    username: lowerUsername,
    name,
    email,
    password: hashedPassword,
    dateOfBirth,
    image: imageUrl,
  });

  const token = jwt.sign(
    { email: email, userId: newUser._id },
    process.env.JWT_SECRET
  );
  res.cookie("token", token, { httpOnly: true });

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
  res.cookie("token", token, { httpOnly: true });
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

  let token;
  if (remember) {
    token = jwt.sign(
      { email: email, userId: user._id },
      process.env.JWT_SECRET
    );
  } else {
    token = jwt.sign(
      { email: email, userId: user._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1h",
      }
    );
  }

  res.cookie("token", token, { httpOnly: true });
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
    if (!user) return res.status(404).send("User not found");
    const imageUrl = req.file ? await uploadToSupabase(req.file) : undefined;

    user.name = name?.trim();
    user.username = username?.trim();
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

    let hashedNewPassword;
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
    user.username = username;
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
    const updatePostInUser = await userModel.findByIdAndUpdate(user._id, {
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
    .populate("likes");

  const user = await userModel.findById(req.user.userId);
  res.render("postDetail", { post, user, dayjs });
});

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
  res.status(404).render('error')
})

// ======================
// Server Start
// ======================
app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
