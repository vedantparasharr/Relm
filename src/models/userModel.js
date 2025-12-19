const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true
    },
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
      default: "https://raw.githubusercontent.com/vedantparasharr/Relm/refs/heads/main/public/images/uploads/default-avatar.png",
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
