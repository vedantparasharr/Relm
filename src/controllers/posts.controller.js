// ======================
// Third-Party Utilities
// ======================
const dayjs = require("dayjs");

// ======================
// Database Models
// ======================
const userModel = require("../models/userModel");
const postModel = require("../models/postModel");

// ======================
// Render Create Post Page
// ======================
const renderNew = async (req, res) => {
  const user = await userModel.findById(req.user.userId);
  res.render("createPost", { user });
};

// ======================
// Render Single Post Page
// ======================
const renderPost = async (req, res) => {
  const post = await postModel
    .findById(req.params.id)
    .populate("author")
    .populate("likes")
    .populate("comments.author");

  const user = await userModel.findById(req.user.userId);
  res.render("postDetail", { post, user, dayjs });
};

// ======================
// Render Edit Post Page
// ======================
const renderEdit = async (req, res) => {
  const post = await postModel.findById(req.params.id);
  const user = await userModel.findById(req.user.userId);

  if (!post) return res.status(404).send("Post not found");
  if (post.author.toString() !== req.user.userId)
    return res.status(403).send("Unauthorized");

  res.render("editPost", { post, user });
};

// ======================
// Handle New Post Creation
// ======================
const handlePost = async (req, res) => {
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
};

// ======================
// Handle Comment Creation
// ======================
const handleComment = async (req, res) => {
  const { content } = req.body;
  const post = await postModel.findById(req.params.id);

  post.comments.push({
    author: req.user.userId,
    content,
  });

  await post.save();
  res.redirect(`/posts/${post._id}`);
};

// ======================
// Handle Comment Deletion
// ======================
const handleDeleteComment = async (req, res) => {
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
};

// ======================
// Handle Post Update
// ======================
const handleEdit = async (req, res) => {
  const { title, content } = req.body;
  const post = await postModel.findById(req.params.id);

  if (!post) return res.status(404).send("Post not found");
  if (post.author.toString() !== req.user.userId)
    return res.status(403).send("Unauthorized");

  await postModel.findByIdAndUpdate(req.params.id, {
    title: title.trim(),
    content: content.trim(),
  });

  res.redirect(`/posts/${req.params.id}`);
};

// ======================
// Handle Post Deletion
// ======================
const handleDelete = async (req, res) => {
  const post = await postModel.findById(req.params.id);

  if (!post) return res.status(404).send("Post not found");
  if (post.author.toString() !== req.user.userId)
    return res.status(403).send("Unauthorized");

  await postModel.findByIdAndDelete(req.params.id);
  await userModel.findByIdAndUpdate(req.user.userId, {
    $pull: { posts: req.params.id },
  });

  res.redirect("/profile");
};

// ======================
// Handle Like / Unlike
// ======================
// controllers/postController.js (handleLike)
const handleLike = async (req, res) => {
  const post = await postModel.findById(req.params.id);
  const userId = req.user.userId;
  if (!post) return res.status(404).send("Post not found!");
  const hasLiked = post.likes.some((u) => u.toString() === userId.toString());
  const updatedPost = await postModel.findByIdAndUpdate(
    post._id,
    hasLiked ? { $pull: { likes: userId } } : { $addToSet: { likes: userId } },
    { new: true }
  );

  return res.json({
    liked: !hasLiked,
    likesCount: updatedPost.likes.length,
  });
};

// ======================
// Exports
// ======================
module.exports = {
  renderNew,
  renderEdit,
  renderPost,
  handlePost,
  handleDelete,
  handleDeleteComment,
  handleLike,
  handleEdit,
  handleComment,
};
