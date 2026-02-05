// src/components/Post.jsx
import { Heart, MessageCircle } from "lucide-react";
import { useState } from "react";
import axios from "axios";

const Post = ({
  userId,
  postId,
  author,
  avatar,
  time,
  title,
  excerpt,
  likes = [],
  comments = [],
  fetchProfile,
}) => {
  const [loading, setLoading] = useState(false);
  const [liked, setLiked] = useState(likes.some((u) => u._id === userId));
  const [likesCount, setLikesCount] = useState(likes.length);

  const handleLike = async () => {
    if (loading) return;
    setLikesCount((prev) => {
      if (liked) {
        prev + 1;
      } else {
        prev - 1;
      }
    });
    setLoading(true);
    try {
      const res = await axios.post(
        `http://localhost:3000/posts/${postId}/like`,
        {},
        { withCredentials: true },
      );
      const { likesCount, liked } = res.data;
      setLikesCount(likesCount);
      setLiked(liked);
      console.log(res.data);
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      fetchProfile();
      setLoading(false);
      console.log(likes);
    }
  };

  return (
    <div className="w-full mx-auto bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-zinc-200">
      <div className="flex items-center gap-3 mb-3">
        <img
          src={avatar || undefined}
          alt={author}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-zinc-200">{author}</p>
          <p className="text-xs text-zinc-500">{time}</p>
        </div>
      </div>

      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-zinc-100 leading-snug">
          {title}
        </h2>

        <p className="text-sm text-zinc-400 line-clamp-4">{excerpt}</p>

        <button className="text-sm font-medium text-blue-400 hover:text-blue-300 hover:underline">
          Read more
        </button>
      </div>

      <div className="flex items-center gap-6 mt-4 text-zinc-400">
        <div
          onClick={handleLike}
          role="button"
          aria-disabled={loading}
          className={`flex items-center gap-1 cursor-pointer transition ${
            liked ? "text-red-500" : "hover:text-red-400"
          } ${loading ? "opacity-60 pointer-events-none" : ""}`}
        >
          <Heart size={18} fill={liked ? "currentColor" : "none"} />
          <span className="text-sm">{likesCount}</span>
        </div>

        <div className="flex items-center gap-1 cursor-pointer hover:text-zinc-200 transition">
          <MessageCircle size={18} />
          <span className="text-sm">{comments.length}</span>
        </div>
      </div>
    </div>
  );
};

export default Post;
