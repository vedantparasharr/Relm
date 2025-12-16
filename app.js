const dayjs = require("dayjs");
const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("./models/userModel");
const postModel = require("./models/postModel");

const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

const verifyToken = (req, res, next) => {
  const token = req.cookies.token;
  if (!token) return res.status(401).send("Access Denied");
  try {
    const verified = jwt.verify(token, "mysecretkey");
    req.user = verified;
    next();
  } catch (err) {
    return res.status(400).send("Invalid Token");
  }
};

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/createUser", async (req, res) => {
  const { username, name, email, password, dateOfBirth } = req.body;

  let isUser = await userModel.findOne({ email: email });
  if (isUser) return res.status(400).send("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await userModel.create({
    username,
    name,
    email,
    password: hashedPassword,
    dateOfBirth,
  });

  const token = jwt.sign({ email: email, userId: newUser._id }, "mysecretkey");
  res.cookie("token", token, { httpOnly: true });

  res.redirect("/auth/signin");
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
    token = jwt.sign({ email: email, userId: user._id }, "mysecretkey");
  } else {
    token = jwt.sign(
      {
        email: email,
        userId: user._id,
      },
      "mysecretkey",
      { expiresIn: "1h" }
    );
  }

  res.cookie("token", token, { httpOnly: true });
  res.redirect("/profile");
});

app.get("/auth/signout", (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
});

app.get("/profile", verifyToken, async (req, res) => {
  const user = await userModel.findById(req.user.userId);
  const posts = await postModel
    .find({ author: user._id })
    .populate("author")
    .populate("likes");
  res.render("profile", { user, posts, dayjs });
});

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
  if (post.author.toString() !== req.user.userId) {
    return res.status(403).send("Unauthorized");
  } else {
    res.render("editPost", { post, user });
  }
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
  if (!post) {
    return res.status(404).send("Post not found");
  }
  if (post.author.toString() !== req.user.userId) {
    return res.status(403).send("Unauthorized");
  } else {
    await postModel.findByIdAndDelete(req.params.id);
  }
  res.redirect("/profile");
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

app.get("/profile/settings", verifyToken, async (req, res) => {
  const user = await userModel.findById(req.user.userId);
  if (!user) return res.status(404).send("User not found");
  res.render("settings", { user, dayjs });
});

app.post("/profile/settings", verifyToken, async (req, res) => {
  const {
    name,
    username,
    dateOfBirth,
    website,
    image,
    bio,
    currentPassword,
    newPassword,
    confirmPassword,
  } = req.body;

  let hashedNewPassword;

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
    hashedNewPassword = await bcrypt.hash(newPassword, 10);
  }

  const updateData = {
    name,
    username,
    dateOfBirth,
    website,
    image,
    bio,
  };

  if (isUserChangingPassword) {
    updateData.password = hashedNewPassword;
  }

  const updatedUser = await userModel.findByIdAndUpdate(
    req.user.userId,
    updateData
  );
  res.redirect("/profile");
});

app.get("/profile/edit", verifyToken, async (req, res) => {
  const user = await userModel.findById(req.user.userId);
  if (!user) return res.status(404).send("User not found");
  res.render("editProfile", { user, dayjs });
});

app.post("/profile/edit", verifyToken, async (req, res) => {
  const { name, username, image, bio } = req.body;

  const user = await userModel.findByIdAndUpdate(req.user.userId, {
    name,
    username,
    image,
    bio,
  });

  if (!user) return res.status(404).send("User not found");

  res.redirect("/profile");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
