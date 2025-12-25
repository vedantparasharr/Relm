const express = require("express");
const { routes } = require("../src/app");
const router = express.Router();

const {
  createUser,
  signin,
  forget,
  resetPassword,
  signout,
} = require("../controllers/auth.controller");

router.get("/createUser", createUser);
router.get("/signin", signin);
router.get("/forget", forget);
router.get("/reset-password/:user", resetPassword);
router.get("/signout", signout);

module.exports = router;
