const sharp = require("sharp");

module.exports = async (buffer) => {
  return await sharp(buffer)
    .resize(256, 256, { fit: "cover" })
    .jpeg({ quality: 70 })
    .toBuffer();
};
