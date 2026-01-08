import { Heart, MessageCircle } from "lucide-react";

const Post = ({
  author = "Sophia Turner",
  avatar,
  time = "2h ago",
  title = "Solo Travel Adventures",
  excerpt = "Exploring the mountains taught me more about myself than any book ever could...",
  likes = 5800,
  comments = 322,
  readTime = "4 min read",
}) => {
  return (
    <div className="w-full max-w-xl mx-auto bg-white rounded-2xl border border-gray-200 p-4">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <img
          src={avatar}
          alt={author}
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <p className="text-sm font-semibold text-gray-900">{author}</p>
          <p className="text-xs text-gray-500">
            {time} · {readTime}
          </p>
        </div>
      </div>

      {/* Blog Content */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold text-gray-900 leading-snug">
          {title}
        </h2>

        <p className="text-sm text-gray-600 line-clamp-4">
          {excerpt}
        </p>

        <button className="text-sm font-medium text-blue-600 hover:underline">
          Read more
        </button>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-6 mt-4 text-gray-600">
        <div className="flex items-center gap-1 cursor-pointer hover:text-red-500">
          <Heart size={18} />
          <span className="text-sm">{likes.toLocaleString()}</span>
        </div>

        <div className="flex items-center gap-1 cursor-pointer hover:text-gray-900">
          <MessageCircle size={18} />
          <span className="text-sm">{comments}</span>
        </div>
      </div>
    </div>
  );
};

export default Post;
