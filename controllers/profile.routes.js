const renderProfile = async (req, res) => {
  if (!req.user.userId) {
    return res.render("authRequired", {
      title: "Profile Unavailable",
      message: "Guest accounts do not have profiles. Sign in to continue.",
    });
  }

  const user = await userModel.findById(req.user.userId);
  if (!user) {
    return res.redirect("/auth/signin");
  }

  const posts = await postModel
    .find({ author: user._id })
    .populate("author")
    .populate("likes");

  res.render("profile", { user, posts, dayjs });
};

const renderAbout = async (req, res) => {
  const user = await userModel.findById(req.user.userId);
  const posts = await postModel
    .find({ author: user._id })
    .populate("author")
    .populate("likes");

  if (!user) return res.status(404).send("User not found");
  res.render("about", { user, posts, dayjs });
};

const renderEdit = async (req, res) => {
  const user = await userModel.findById(req.user.userId);
  if (!user) return res.status(404).send("User not found");

  res.render("editProfile", { user, dayjs });
};

const renderSettings = async (req, res) => {
  const user = await userModel.findById(req.user.userId);
  if (!user) return res.status(404).send("User not found");

  res.render("settings", { user, dayjs });
};

