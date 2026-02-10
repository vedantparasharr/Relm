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
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/profile", {
          withCredentials: true,
        });

        const { user } = res.data;

        setProfilePicture(user.image);
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

        console.log(posts);
        setPosts(posts);
      } catch (err) {
        console.error(err);
      }
    };

    fetchPosts();
  }, []);

  const post2 = [
    {
      id: 1,
      user: "Alex Rivera",
      handle: "@arivera",
      time: "2h",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
      content:
        "Just shipped the new dark mode update. It's not just about inverting colors; it's about managing contrast ratios and elevation. 🌙✨ #DesignSystem #UX",
      likes: 124,
      comments: 18,
      shares: 12,
    },
    {
      id: 2,
      user: "Sarah Chen",
      handle: "@schen_dev",
      time: "4h",
      avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
      content:
        "Clean code is not just about functionality, it's about readability. If you can't read it like a sentence, rewrite it.",
      image:
        "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=1000&q=80",
      likes: 856,
      comments: 42,
      shares: 89,
    },
    {
      id: 3,
      user: "Jordan Lee",
      handle: "@jlee_arch",
      time: "6h",
      avatar: "https://i.pravatar.cc/150?u=a04258114e29026302d",
      content:
        "Minimalism isn't about having less. It's about making room for more of what matters.",
      likes: 2.15,
      comments: 140,
      shares: 320,
    },
  ];

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
            <Post key={post._id} post={post} />
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
