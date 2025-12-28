const dayjs = require("dayjs");

const userModel = require("./models/userModel");
const postModel = require("./models/postModel");
const { render } = require("../src/app");

const renderNew = async (req, res) => {
  const user = await userModel.findById(req.user.userId);
  res.render("createPost", { user });
};

const renderPost = async (req, res) => {
  const post = await postModel
    .findById(req.params.id)
    .populate("author")
    .populate("likes")
    .populate("comments.author");

  const user = await userModel.findById(req.user.userId);
  res.render("postDetail", { post, user, dayjs });
};

const renderEdit = async (req, res) => {
  const post = await postModel.findById(req.params.id);
  const user = await userModel.findById(req.user.userId);

  if (!post) return res.status(404).send("Post not found");
  if (post.author.toString() !== req.user.userId)
    return res.status(403).send("Unauthorized");

  res.render("editPost", { post, user });
};

module.exports = { renderNew, renderEdit, renderPost };
