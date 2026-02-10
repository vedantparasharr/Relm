// src/components/Post.jsx
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Image,
  Smile,
  BarChart2,
} from "lucide-react";
import { useState } from "react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

dayjs.extend(relativeTime);

const Post = ({ post }) => {
  // const [loading, setLoading] = useState(false);
  // const [liked, setLiked] = useState(likes.some((u) => u._id === userId));
  // const [likesCount, setLikesCount] = useState(likes.length);

  // const handleLike = async () => {
  //   if (loading) return;
  //   setLikesCount((prev) => (liked ? prev - 1 : prev + 1));
  //   setLiked((prev) => !prev);
  //   setLoading(true);
  //   try {
  //     const res = await axios.post(
  //       `http://localhost:3000/posts/${postId}/like`,
  //       {},
  //       { withCredentials: true },
  //     );
  //     const { likesCount, liked } = res.data;
  //     setLikesCount(likesCount);
  //     setLiked(liked);
  //     console.log(res.data);
  //   } catch (error) {
  //     console.error("Error liking post:", error);
  //   } finally {
  //     setLoading(false);
  //     console.log(likes);
  //   }
  // };

  return (
    <article
      key={post._id}
      className="px-4 py-4 sm:rounded-xl bg-neutral-900/30 border border-neutral-800/60 hover:bg-neutral-900/50 transition-colors cursor-pointer"
    >
      <div className="flex gap-4">
        {/* Avatar */}
        <div className="flex-shrink-0">
          <img
            src={post.author.image}
            alt={post.author.name}
            className="w-10 h-10 rounded-full object-cover border border-neutral-800"
          />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-1">
            <div className="flex items-center gap-2 overflow-hidden">
              <span className="font-semibold text-white truncate">
                {post.author.name}
              </span>
              <span className="text-neutral-500 text-sm truncate">
                {post.author.username}
              </span>
              <span className="text-neutral-600 text-[10px]">•</span>
              <span className="text-neutral-500 text-sm">{dayjs(post.createdAt).fromNow()}</span>
            </div>
            <button className="text-neutral-500 hover:text-white transition-colors">
              <MoreHorizontal size={16} />
            </button>
          </div>

          {/* Body Text */}
          <p className="text-neutral-200 text-[15px] leading-relaxed mb-3 whitespace-pre-wrap">
            {post.content}
          </p>

          {/* Optional Image Attachment */}
          {post.image && (
            <div className="mb-3 rounded-lg overflow-hidden border border-neutral-800">
              <img
                src={post.image}
                alt="Post content"
                className="w-full h-auto object-cover"
              />
            </div>
          )}

          {/* Action Bar */}
          <div className="flex items-center justify-between text-neutral-500 max-w-md mt-2">
            <button className="flex items-center gap-2 group hover:text-blue-400 transition-colors">
              <div className="p-1.5 rounded-full group-hover:bg-blue-500/10 transition-colors">
                <MessageCircle size={18} />
              </div>
              <span className="text-xs">{post.comments?.length}</span>
            </button>

            <button className="flex items-center gap-2 group hover:text-green-400 transition-colors">
              <div className="p-1.5 rounded-full group-hover:bg-green-500/10 transition-colors">
                <Share2 size={18} />
              </div>
              <span className="text-xs">{post.comments?.length || 0}</span>
            </button>

            <button className="flex items-center gap-2 group hover:text-pink-500 transition-colors">
              <div className="p-1.5 rounded-full group-hover:bg-pink-500/10 transition-colors">
                <Heart size={18} />
              </div>
              <span className="text-xs">{post.likes?.length || 0}</span>
            </button>

            <button className="flex items-center gap-2 group hover:text-blue-400 transition-colors">
              <div className="p-1.5 rounded-full group-hover:bg-blue-500/10 transition-colors">
                <BarChart2 size={18} />
              </div>
            </button>
          </div>
        </div>
      </div>
    </article>
  );
};

export default Post;
