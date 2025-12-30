const express = require("express");
const router = express.Router();

const verifyToken = require("../src/utils/verifyToken");
const {
  renderEdit,
  renderPost,
  renderNew,
  handleEdit,
  handleComment,
  handleDeleteComment,
  handleLike,
  handlePost,
  handleDelete,
} = require("../controllers/posts.controller");

router.get("/new", verifyToken, renderNew);
router.get("/:id", verifyToken, renderPost);
router.get("/:id/edit", verifyToken, renderEdit);

router.post("/", verifyToken, handlePost);
router.post("/:id/comments", verifyToken, handleComment);
router.post(
  "/:postId/comments/:commentId/delete",
  verifyToken,
  handleDeleteComment
);
router.post("/:id/edit", verifyToken, handleEdit);
router.post("/:id/delete", verifyToken, handleDelete);
router.post("/:id/like", verifyToken, handleLike);

module.exports = router;
