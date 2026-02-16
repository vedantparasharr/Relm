import React, { useState, useEffect, useCallback } from "react";
import { Image, Smile, BarChart2 } from "lucide-react";

import Nav from "../components/Nav";
import PostCard from "../components/PostCard";
import { getProfile, getPosts, createPost } from "../services/homeService";

const Home = () => {
  /* ----------------------------- STATE ----------------------------- */
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState("");

  /* --------------------------- FETCH USER --------------------------- */
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getProfile();
        setUser(res.data.user);
      } catch (error) {
        console.error(error);
      }
    };

    fetchUser();
  }, []);

  /* --------------------------- FETCH POSTS -------------------------- */
  const fetchPosts = useCallback(async () => {
    try {
      const res = await getPosts();
      setPosts(res.data.posts);
    } catch (error) {
      console.error(error);
    }
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  /* --------------------------- CREATE POST -------------------------- */
  const handlePost = async () => {
    if (!content.trim()) return;

    try {
      await createPost(content);
      setContent("");
      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };

  /* -------------------------- RENDER HELPERS ------------------------ */
  const renderPosts = () =>
    posts.map((post) => (
      <PostCard
        key={post._id}
        post={post}
        userId={user?._id}
        setPosts={setPosts}
      />
    ));

  /* ------------------------------- UI ------------------------------- */
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-neutral-800">
      <Nav />

      <main className="max-w-2xl mx-auto pt-4 pb-20 px-0 sm:px-4">
        {/* Create post box */}
        <div className="mb-6 px-4 py-4 sm:rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors duration-200">
          <div className="flex gap-4">
            <img
              src={user?.image || "/default-avatar.png"}
              alt="My Avatar"
              className="w-10 h-10 rounded-full object-cover border border-neutral-800"
            />

            <div className="flex-1">
              <input
                type="text"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="What's on your mind?"
                className="w-full bg-transparent text-lg placeholder-neutral-500 focus:outline-none text-white mb-4"
              />

              <div className="flex items-center justify-between border-t border-neutral-800 pt-3">
                {/* Post options */}
                <div className="flex gap-4 text-neutral-500">
                  <button className="hover:text-blue-400 transition-colors">
                    <Image size={18} />
                  </button>
                  <button className="hover:text-blue-400 transition-colors">
                    <BarChart2 size={18} />
                  </button>
                  <button className="hover:text-blue-400 transition-colors">
                    <Smile size={18} />
                  </button>
                  (Upcoming features){" "}
                </div>

                {/* Submit post */}
                <button
                  onClick={handlePost}
                  className="px-4 py-1.5 bg-white text-black font-semibold rounded-full text-sm hover:bg-neutral-200 transition-colors"
                >
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed */}
        <div className="flex flex-col gap-4">{renderPosts()}</div>

        {/* Footer */}
        <div className="py-8 text-center text-neutral-600 text-sm">
          You're all caught up
        </div>
      </main>
    </div>
  );
};

export default Home;
