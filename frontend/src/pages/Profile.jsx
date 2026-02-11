import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../components/Nav";
import ProfileHeader from "../components/ProfileHeader";
import About from "../components/About";
import Post from "../components/Post";

const Profile = () => {
  const [activeTab, setActiveTab] = useState("posts");

  const [userId, setUserId] = useState("");
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [email, setEmail] = useState("");
  const [createdAt, setCreatedAt] = useState("");
  const [profilePicture, setProfilePicture] = useState("");
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchProfile = async () => {
    try {
      const res = await axios.get("http://localhost:3000/profile", {
        withCredentials: true,
      });

      const { user, posts } = res.data;

      setUserId(user._id);
      setUsername(user.username);
      setName(user.name);
      setBio(user.bio || "");
      setEmail(user.email);
      setCreatedAt(user.createdAt);
      setProfilePicture(user.image);
      setPosts(posts || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white font-sans flex items-center justify-center">
        <div className="animate-pulse text-neutral-500">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-neutral-800">
      {/* Top Navigation Bar */}
      <Nav />

      <main className="max-w-2xl mx-auto pt-4 pb-20 px-0 sm:px-4">
        {/* Profile Header Card - Styled to match 'Create Post' input area */}
        <div className="mb-6 px-4 py-6 sm:rounded-xl bg-neutral-900/50 border border-neutral-800 transition-colors duration-200">
          <ProfileHeader
            username={username}
            name={name}
            bio={bio}
            profilePicture={profilePicture}
            postsCount={posts.length}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
          />
        </div>

        {/* Content Area */}
        <div className="flex flex-col gap-4">
          {/* Posts Feed - Matches Home Feed styling */}
          {activeTab === "posts" && (
            <>
              {posts.length > 0 ? (
                posts.map((post) => <Post key={post._id} post={post} userId={userId} />)
              ) : (
                <div className="py-8 text-center text-neutral-600 text-sm">
                  No posts yet.
                </div>
              )}
            </>
          )}

          {/* About Section - Wrapped in a consistent card container */}
          {activeTab === "about" && (
            <div className="px-4 py-6 sm:rounded-xl bg-neutral-900/50 border border-neutral-800">
              <About
                user={{ username, email, bio, createdAt }}
                postsCount={posts.length}
              />
            </div>
          )}
        </div>

        {/* End of Content Indicator */}
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