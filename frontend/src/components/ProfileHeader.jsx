import React from "react";
import { Link } from "react-router-dom";

const ProfileHeader = ({
  username,
  name,
  bio,
  profilePicture,
  postsCount,
  activeTab,
  setActiveTab,
}) => {
  /* --------------------------- AVATAR UI ---------------------------- */
  const renderAvatar = () => {
    if (profilePicture) {
      return (
        <img
          src={profilePicture}
          alt="avatar"
          className="h-full w-full object-cover"
        />
      );
    }

    return (
      <div className="h-full w-full bg-zinc-700 flex items-center justify-center text-zinc-300 text-3xl">
        {name ? name[0].toUpperCase() : "U"}
      </div>
    );
  };

  /* ------------------------------- UI ------------------------------- */
  return (
    <>
      {/* Profile info */}
      <div className="flex items-start gap-8 pb-8 w-full">
        {/* Avatar */}
        <div className="h-40 w-40 rounded-full overflow-hidden shrink-0">
          {renderAvatar()}
        </div>

        {/* User details */}
        <div className="flex-1">
          <p className="font-semibold text-2xl text-zinc-200">{name}</p>
          <h3 className="font-medium text-zinc-500 mt-0.5">@{username}</h3>

          {/* Stats */}
          <div className="flex gap-6 text-sm text-zinc-300 mt-4">
            <p>
              <span className="font-semibold">{postsCount}</span> Posts
            </p>
            <p>
              <span className="font-semibold">0</span> Followers
            </p>
            <p>
              <span className="font-semibold">0</span> Following
            </p>
          </div>

          {/* Bio */}
          <p className="text-zinc-300 max-w-xl mt-5 leading-relaxed">{bio}</p>

          {/* Actions */}
          <div className="flex gap-3 mt-5">
            <Link
              to="/profile/settings"
              className="px-4 py-2 text-sm bg-zinc-800/70 rounded-lg hover:bg-zinc-700 transition"
            >
              Account Settings
            </Link>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex w-full gap-4 justify-between mt-6">
        <button
          onClick={() => setActiveTab("posts")}
          className={`py-4 px-6 w-full rounded-xl transition ${
            activeTab === "posts"
              ? "bg-zinc-700"
              : "bg-zinc-800 hover:opacity-80"
          }`}
        >
          Posts
        </button>

        <button
          onClick={() => setActiveTab("about")}
          className={`py-4 px-6 w-full rounded-xl transition ${
            activeTab === "about"
              ? "bg-zinc-700"
              : "bg-zinc-800 hover:opacity-80"
          }`}
        >
          About
        </button>
      </div>
    </>
  );
};

export default ProfileHeader;
