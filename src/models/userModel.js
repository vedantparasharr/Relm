const mongoose = require("mongoose");
mongoose.connect(process.env.MONGO_URI);
// mongoose.connect("mongodb://localhost:27017/blogapp");

const userSchema = mongoose.Schema(
  {
    username: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
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
      default:
        "https://raw.githubusercontent.com/vedantparasharr/Relm/refs/heads/main/src/public/images/uploads/default-avatar.png",
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Post",
      },
    ],
    otpHash: String,
    otpExpires: {
      type: Date,
    },
    otpPurpose: {
      type: String,
      enum: ["verify_email", "reset_password"],
    },
    verified: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
