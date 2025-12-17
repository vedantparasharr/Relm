const multer = require("multer");
const path = require("path");
const dayjs = require("dayjs");
const crypto = require("crypto");

// Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/images/uploads");
  },
  filename: function (req, file, cb) {
    const ext = path.extname(file.originalname);
    const uniqueName =
      Date.now() + "-" + crypto.randomBytes(6).toString("hex") + ext;
    cb(null, uniqueName);
  },
});

const upload = multer({ storage: storage });
module.exports = upload;
