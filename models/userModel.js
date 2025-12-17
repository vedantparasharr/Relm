const mongoose = require("mongoose");
mongoose.connect("mongodb://localhost:27017/blogapp");

const userSchema = mongoose.Schema(
  {
    username: String,
    name: String,
    email: String,
    password: String,
    dateOfBirth: Date,
    website: String,
    bio: {
      type: String,
      maxLength: 120,
      default: "This user prefers to keep an air of mystery about them.",
    },
    image: {
      type: String,
      default: "default-avatar.png",
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
