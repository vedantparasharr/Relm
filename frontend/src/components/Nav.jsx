import React from "react";
import { Link } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const Nav = () => {
  const [profilePicture, setProfilePicture] = useState("/default-avatar.png");

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

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-900 bg-black/80 backdrop-blur-md">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="font-bold text-lg tracking-tight">
          <img className="h-18" src="/logo-dark.png" alt="" />
        </div>
        <div className="flex gap-4 text-sm font-medium text-neutral-400">
          <button className="text-white hover:text-white transition-colors">
            For You
          </button>
          <button className="hover:text-white transition-colors">
            Following
          </button>
        </div>
        <div className="w-8 h-8 rounded-full overflow-hidden bg-neutral-800">
          {" "}
          <img src={profilePicture} className="h-8 w-8" alt="" />{" "}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
