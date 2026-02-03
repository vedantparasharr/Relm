import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import axios from "axios";

const Post = ({
  postId,
  author,
  avatar,
  time,
  title,
  excerpt,
  likes,
  comments,
}) => {
  const [likesCount, setLikesCount] = useState(likes);
  const [liked, setLiked] = useState(false);

  const handleLike = async () => {
    const res = await axios.post(
      `http://localhost:3000/posts/${postId}/like`,
      {},
      {
        withCredentials: true,
      }
    );
    console.log(res.data);
    const { liked, likesCount } = res.data;
    setLikesCount(likesCount)
  };

  return (
    <div className="w-full mx-auto bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-zinc-200">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={avatar}
          alt={author}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-zinc-200">{author}</p>
          <p className="text-xs text-zinc-500">{time}</p>
        </div>
      </div>

      {/* Content */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-100 leading-snug">
          {title}
        </h2>

        <p className="text-sm text-zinc-400 line-clamp-4">{excerpt}</p>

        <button className="text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline">
          Read more
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 mt-4 text-zinc-400">
        <div
          onClick={handleLike}
          className="flex items-center gap-1 cursor-pointer hover:text-red-400 transition"
        >
          <Heart size={18} />
          <span className="text-sm">{likesCount.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-1 cursor-pointer hover:text-zinc-200 transition">
          <MessageCircle size={18} />
          <span className="text-sm">{comments}</span>
        </div>
      </div>
    </div>
  );
};

export default Post;
