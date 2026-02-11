import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Heart,
  MessageCircle,
  Share2,
  MoreHorizontal,
  Image,
  Smile,
  BarChart2,
} from "lucide-react";

import Nav from "../components/Nav";
import Post from "../components/Post";

const Home = () => {
  const [profilePicture, setProfilePicture] = useState("/default-avatar.png");
  const [userId, setUserId] = useState(null);
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/profile", {
          withCredentials: true,
        });

        const { user } = res.data;

        setProfilePicture(user.image);
        setUserId(user._id);
      } catch (err) {
        console.error(err);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get("http://localhost:3000/home", {
          withCredentials: true,
        });

        const { posts } = res.data;
        setPosts(posts);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-neutral-800">
      {/* Top Navigation Bar */}
      <Nav></Nav>

      <main className="max-w-2xl mx-auto pt-4 pb-20 px-0 sm:px-4">
        {/* Create Post Card */}
        <div className="mb-6 px-4 py-4 sm:rounded-xl bg-neutral-900/50 border border-neutral-800 hover:border-neutral-700 transition-colors duration-200">
          <div className="flex gap-4">
            <img
              src={profilePicture}
              alt="My Avatar"
              className="w-10 h-10 rounded-full object-cover border border-neutral-800"
            />
            <div className="flex-1">
              <input
                type="text"
                placeholder="What's on your mind?"
                className="w-full bg-transparent text-lg placeholder-neutral-500 focus:outline-none text-white mb-4"
              />
              <div className="flex items-center justify-between border-t border-neutral-800 pt-3">
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
                </div>
                <button className="px-4 py-1.5 bg-white text-black font-semibold rounded-full text-sm hover:bg-neutral-200 transition-colors">
                  Post
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Feed Stream */}
        <div className="flex flex-col gap-4">
          {posts.map((post) => (
            <Post key={post._id} post={post} userId={userId} />
          ))}
        </div>

        {/* Loading / End of Feed Indicator */}
        <div className="py-8 text-center text-neutral-600 text-sm">
          You're all caught up
        </div>
      </main>
    </div>
  );
};

export default Home;
