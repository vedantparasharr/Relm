const express = require("express");
const { routes } = require("../src/app");
const router = express.Router();
const upload = require("../src/config/multer");

const {
  renderSignup,
  renderSignin,
  renderForget,
  renderReset,
  handleSignout,
  handleSignup,
  handleVerifyEmail,
  handleGuest,
} = require("../controllers/auth.controller");
const app = require("../src/app");

// ==================================
// GET REQUESTS
// ==================================

router.get("/signup", renderSignup);
router.get("/signin", renderSignin);
router.get("/forget", renderForget);
router.get("/reset-password/:user", renderReset);
router.get("/signout", handleSignout);

// =============================
// POST REQUESTS
// =============================
router.post("/signup", upload.single("image"), handleSignup);
router.post("/auth/verify-email", handleVerifyEmail);
router.get("/guest", handleGuest);

// app.post("/signin", async (req, res) => {
//   const { email, password, remember } = req.body;

//   const user = await userModel.findOne({ email: email });
//   if (!user) return res.status(400).send("Invalid email or password");

//   const isPasswordValid = await bcrypt.compare(password, user.password);
//   if (!isPasswordValid)
//     return res.status(400).send("Invalid email or password");

//   if (!user.verified) {
//     sendOTPEmail(user).catch(console.error);
//     return res.render("verify", { user: user._id });
//   }

//   let token;
//   if (remember) {
//     token = jwt.sign(
//       { email: email, userId: user._id },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "30d",
//       }
//     );
//     res.cookie("token", token, {
//       httpOnly: true,
//       maxAge: 30 * 24 * 60 * 60 * 1000,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//     });
//   } else {
//     token = jwt.sign(
//       { email: email, userId: user._id },
//       process.env.JWT_SECRET,
//       {
//         expiresIn: "1d",
//       }
//     );
//     res.cookie("token", token, {
//       httpOnly: true,
//       maxAge: 1 * 24 * 60 * 60 * 1000,
//       secure: process.env.NODE_ENV === "production",
//       sameSite: "lax",
//     });
//   }
//   res.redirect("/profile");
// });
// app.post("/forget", async (req, res) => {
//   const { email } = req.body;
//   const user = await userModel.findOne({ email });
//   if (!user) {
//     return res.status(400).send("No account found with this email");
//   }
//   sendOTPEmail(user).catch(console.error);
//   user.otpPurpose = "reset_password";
//   user.otpHash = undefined;
//   user.otpExpires = undefined;
//   await user.save();
//   res.render("verify", { user: user._id });
// });
// app.post("/reset-password/:user", async (req, res) => {
//   const user = await userModel.findById(req.params.user);
//   const { password, confirmPassword } = req.body;

//   if (!user) return res.status(400).send("User does not exist.");
//   if (password !== confirmPassword)
//     return res.status(400).send("Passwords does not match");

//   user.password = await bcrypt.hash(password, 10);
//   user.otpPurpose = undefined;
//   user.otpHash = undefined;
//   user.otpExpires = undefined;
//   await user.save();

//   return res.redirect("/auth/signin");
// });
module.exports = router;
