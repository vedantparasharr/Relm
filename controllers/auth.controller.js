const createUser = (req, res) => {
  res.render("index");
};

const signin = (req, res) => {
  res.render("signin");
};

const forget = (req, res) => {
  res.render("forget");
};

const resetPassword = async (req, res) => {
  const user = await userModel.findById(req.params.user);
  if (!user) return res.status(404).send("User does not exist");
  if (user.otpPurpose !== "reset_password")
    return res.status(403).send("Unauthorised");

  res.render("reset", { user });
};

const signout = (req, res) => {
  res.clearCookie("token");
  res.redirect("/");
};

module.exports = { createUser, signin, forget, resetPassword, signout };
