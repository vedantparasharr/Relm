const express = require("express");
const router = express.Router();

const verifyToken = require("../src/utils/verifyToken");
const {
  renderProfile,
  renderAbout,
  renderEdit,
  renderSettings,
  handleEdit,
  handleSettings,
} = require("../controllers/profile.routes");
const upload = require("../src/config/multer");

router.get("/", verifyToken, renderProfile);
router.get("/about", verifyToken, renderAbout);
router.get("/edit", verifyToken, renderEdit);
router.get("/settings", verifyToken, renderSettings);

router.post("/settings", verifyToken, upload.single("image"), handleEdit);
router.post("/settings", verifyToken, upload.single("image"), handleSettings);