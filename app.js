const path = require("path");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const userModel = require("./models/userModel");

const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.use(express.static(path.join(__dirname, "public")));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.render("index");
});

app.post("/createUser", async (req, res) => {
  const { username, name, email, password, dateOfBirth } = req.body;

  let isUser = await userModel.findOne({ email: email });
  if (isUser) return res.status(400).send("User already exists");

  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = await userModel.create({
    username,
    name,
    email,
    password: hashedPassword,
    dateOfBirth,
  });

  const token = jwt.sign({ email: email, userId: newUser._id }, "mysecretkey");
  res.cookie("token", token, { httpOnly: true });

  res.redirect("/auth/signin");
});

app.get("/auth/signin", (req, res) => {
  res.render("signin");
});

app.post("/auth/signin", async (req, res) => {
  const { email, password, remember } = req.body;

  const user = await userModel.findOne({ email: email });
  if (!user) return res.status(400).send("Invalid email or password");

  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid)
    return res.status(400).send("Invalid email or password");

  let token;
  if (remember) {
    token = jwt.sign({ email: email, userId: user._id }, "mysecretkey");
  } else {
    token = jwt.sign(
      {
        email: email,
        userId: user._id,
      },
      "mysecretkey",
      { expiresIn: "1h" }
    );
  }

  res.cookie("token", token, { httpOnly: true });
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Server is running at http://localhost:${port}`);
});
