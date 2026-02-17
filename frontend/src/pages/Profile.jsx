import React, { useEffect, useState, useCallback } from "react";
import axios from "axios";

import Nav from "../components/Nav";
import ProfileHeader from "../components/ProfileHeader";
import About from "../components/About";
import PostCard from "../components/PostCard";

const API_URL = import.meta.env.VITE_API_URL;

const Profile = ({onLogout}) => {
  /* ----------------------------- STATE ----------------------------- */
  const [activeTab, setActiveTab] = useState("posts");
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* -------------------------- FETCH PROFILE ------------------------- */
  const fetchProfile = useCallback(async () => {
    try {
      const res = await axios.get(`${API_URL}/profile`, {
        withCredentials: true,
      });

      const { user, posts } = res.data;

      setUser(user);
      setPosts(posts || []);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ------------------------------ EFFECTS --------------------------- */
  useEffect(() => {
    fetchProfile();
  }, [fetchProfile]);

  /* ---------------------------- LOADING UI -------------------------- */
  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center">
        <div className="animate-pulse text-neutral-500">Loading profile...</div>
      </div>
    );
  }

  /* --------------------------- TAB CONTENT -------------------------- */
  const renderPosts = () => {
    if (!posts.length) {
      return (
        <div className="py-8 text-center text-neutral-600 text-sm">
          No posts yet.
        </div>
      );
    }

    return posts.map((post) => (
      <PostCard
        key={post._id}
        post={post}
        userId={user?._id}
        setPosts={setPosts}
      />
    ));
  };

  const renderAbout = () => (
    <div className="px-4 py-6 sm:rounded-xl bg-neutral-900/50 border border-neutral-800">
      <About user={user} postsCount={posts.length} />
    </div>
  );

  /* ------------------------------- UI -------------------------------- */
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-neutral-800">
      <Nav onLogout={onLogout} />

      <main className="max-w-2xl mx-auto pt-4 pb-20 px-0 sm:px-4">
        {/* Profile summary */}
        <div className="mb-6 px-4 py-6 sm:rounded-xl bg-neutral-900/50 border border-neutral-800">
          <ProfileHeader
            username={user?.username}
            name={user?.name}
            bio={user?.bio || ""}
            profilePicture={user?.image}
            postsCount={posts.length}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Tab content */}
        <div className="flex flex-col gap-4">
          {activeTab === "posts" && renderPosts()}
          {activeTab === "about" && renderAbout()}
        </div>

        {/* Footer text */}
        {activeTab === "posts" && posts.length > 0 && (
          <div className="py-8 text-center text-neutral-600 text-sm">
            End of profile
          </div>
        )}
      </main>
    </div>
  );
};

export default Profile;
