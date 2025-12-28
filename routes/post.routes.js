const express = require("express");
const router = express.Router();

const verifyToken = require("../src/utils/verifyToken");
const {
  renderEdit,
  renderPost,
  renderNew,
} = require("../controllers/posts.controller");

router.get("/new", verifyToken, renderNew);
router.get("/:id", verifyToken, renderPost);
router.get("/:id/edit", verifyToken, renderEdit);

module.exports = router;
