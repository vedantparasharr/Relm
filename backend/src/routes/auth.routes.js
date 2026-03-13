const express = require("express");
const router = express.Router();
const upload = require("../config/multer");

const {
  renderReset,
  handleSignout,
  handleSignup,
  handleVerifyEmail,
  handleGuest,
  handleSignin,
  handleForget,
  handleReset,
} = require("../controllers/auth.controller");
const verifyToken = require("../utils/verifyToken");

// ==================================
// GET REQUESTS
// ==================================

router.get("/reset-password/:user", renderReset);
router.get("/signout", handleSignout);
// =============================
// POST REQUESTS
// =============================
router.post("/signup", upload.single("image"), handleSignup);
router.post("/verify-email", handleVerifyEmail);
router.get("/guest", handleGuest);
router.post("/signin", handleSignin);
router.post("/forget", handleForget);
router.post("/reset-password/:user", handleReset);

module.exports = router;
