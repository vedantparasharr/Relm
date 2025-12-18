const supabase = require("../configs/supabase");
const compressAvatar = require("./compressAvatar");
const { randomUUID } = require("crypto");

module.exports = async (file) => {
  const compressedBuffer = await compressAvatar(file.buffer);

  const filePath = `${randomUUID()}.jpg`;

  const { error } = await supabase.storage
    .from("avatars relm")
    .upload(filePath, compressedBuffer, {
      contentType: "image/jpeg",
    });

  if (error) throw error;

  const { data } = supabase.storage
    .from("avatars relm")
    .getPublicUrl(filePath);

  return data.publicUrl;
};
