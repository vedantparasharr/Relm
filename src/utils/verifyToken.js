const verifyToken = (req, res, next) => {
  const token = req.cookies.token;

  if (!token) {
    return res.status(401).render("authRequired", {
      title: "Sign in required!",
      message: "Please Sign in or continue as guest",
    });
  }

  try {
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    return next();
  } catch (err) {
    res.clearCookie("token");
    return res.status(401).render("authRequired", {
      title: "Sign in required!",
      message: "Please Sign in or continue as guest",
    });
  }
};

module.exports = verifyToken;
