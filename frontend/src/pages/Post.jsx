import React, { useEffect, useState, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { ArrowLeft, Send, MessageCircle } from "lucide-react";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";

import Nav from "../components/Nav";
import PostCard from "../components/PostCard";

dayjs.extend(relativeTime);

const Post = () => {
  /* ----------------------------- ROUTER ----------------------------- */
  const { id } = useParams();
  const navigate = useNavigate();

  /* ------------------------------ STATE ----------------------------- */
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [submittingComment, setSubmittingComment] = useState(false);

  /* ------------------------- FETCH CURRENT USER --------------------- */
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/profile", {
          withCredentials: true,
        });
        setCurrentUser(res.data.user);
      } catch (error) {
        console.error("Error fetching profile:", error);
      }
    };

    fetchProfile();
  }, []);

  /* --------------------------- FETCH POST --------------------------- */
  const fetchPost = useCallback(async () => {
    try {
      const res = await axios.get(`http://localhost:3000/posts/${id}`, {
        withCredentials: true,
      });
      setPost(res.data.post);
    } catch (error) {
      console.error("Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchPost();
  }, [fetchPost]);

  /* ------------------------ SUBMIT COMMENT -------------------------- */
  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    setSubmittingComment(true);

    try {
      await axios.post(
        `http://localhost:3000/posts/${id}/comments`,
        { content: commentText },
        { withCredentials: true },
      );

      setCommentText("");
      fetchPost();
    } catch (error) {
      console.error("Error posting comment:", error);
    } finally {
      setSubmittingComment(false);
    }
  };

  /* ---------------------------- LOADING UI -------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500" />
      </div>
    );
  }

  /* --------------------------- NOT FOUND UI ------------------------- */
  if (!post) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center gap-4">
        <p className="text-neutral-500">Post not found</p>
        <button
          onClick={() => navigate(-1)}
          className="text-blue-400 hover:underline"
        >
          Go Back
        </button>
      </div>
    );
  }

  /* ------------------------------- UI ------------------------------- */
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-neutral-800">
      <Nav />

      <main className="max-w-2xl mx-auto pt-4 pb-20 px-0 sm:px-4">
        {/* Header */}
        <div className="flex items-center gap-4 px-4 mb-4">
          <button
            onClick={() => navigate(-1)}
            className="p-2 rounded-full hover:bg-neutral-900 transition-colors text-neutral-400 hover:text-white"
          >
            <ArrowLeft size={20} />
          </button>
          <h2 className="text-xl font-bold">Post</h2>
        </div>

        {/* Main post */}
        <div className="mb-6">
          <PostCard post={post} userId={currentUser?._id} fullPost />
        </div>

        {/* Comment input */}
        <div className="border-t border-neutral-800 px-4 py-4 mb-2">
          <div className="flex gap-4">
            <img
              src={currentUser?.image || "/default-avatar.png"}
              alt="Current User"
              className="w-10 h-10 rounded-full object-cover border border-neutral-800"
            />

            <form onSubmit={handleCommentSubmit} className="flex-1">
              <div className="relative">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Post your reply"
                  className="w-full bg-neutral-900/50 text-white rounded-full py-3 px-4 pr-12 border border-neutral-800 focus:border-blue-500/50 focus:outline-none focus:bg-black transition-colors placeholder-neutral-500"
                />

                <button
                  type="submit"
                  disabled={!commentText.trim() || submittingComment}
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full text-blue-500 hover:bg-blue-500/10 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
                >
                  <Send size={18} />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Comments list */}
        <div className="flex flex-col">
          {post.comments && post.comments.length > 0 ? (
            post.comments.map((comment, index) => (
              <CommentItem key={comment._id || index} comment={comment} />
            ))
          ) : (
            <div className="py-10 text-center text-neutral-600">
              <p>No comments yet. Be the first to reply!</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

/* -------------------------- COMMENT ITEM --------------------------- */
const CommentItem = ({ comment }) => {
  return (
    <div className="px-4 py-3 border-b border-neutral-800/50 hover:bg-neutral-900/20 transition-colors">
      <div className="flex gap-3">
        <img
          src={comment.author?.image || "/default-avatar.png"}
          alt={comment.author?.username}
          className="w-9 h-9 rounded-full object-cover border border-neutral-800"
        />

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-0.5">
            <span className="font-semibold text-white text-sm">
              {comment.author?.name}
            </span>
            <span className="text-neutral-500 text-sm">
              @{comment.author?.username}
            </span>
            <span className="text-neutral-600 text-[10px]">•</span>
            <span className="text-neutral-500 text-xs">
              {dayjs(comment.createdAt).fromNow()}
            </span>
          </div>

          <p className="text-neutral-300 text-sm leading-relaxed whitespace-pre-wrap">
            {comment.content}
          </p>

          {/* Comment actions */}
          <div className="flex items-center gap-6 mt-2 text-neutral-500">
            <button className="flex items-center gap-1.5 hover:text-blue-400 transition-colors">
              <MessageCircle size={14} />
              <span className="text-xs">Reply(upcoming)</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Post;
