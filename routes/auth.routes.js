const express = require("express");
const { routes } = require("../src/app");
const router = express.Router();
const upload = require("../src/config/multer")

const {
  createUser,
  signin,
  forget,
  resetPassword,
  signout,
  createUserr,
} = require("../controllers/auth.controller");

// ==================================
// GET REQUESTS
// ==================================

router.get("/create-user", createUser);
router.get("/signin", signin);
router.get("/forget", forget);
router.get("/reset-password/:user", resetPassword);
router.get("/signout", signout);

// =============================
// POST REQUESTS
// =============================
router.post("/create-user", upload.single("image"), createUserr);

module.exports = router;
