const express = require("express");
const router = express.Router();

const verifyToken = require("../src/utils/verifyToken");
const { renderPosts } = require("../controllers/posts.controller");



module.exports = router;
