import React, { useEffect, useState } from "react";
import axios from "axios";
import Nav from "../components/Nav";
import ProfileHeader from "../components/ProfileHeader";
import Posts from "../components/Posts";
import About from "../components/About";

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
      <main className="min-h-screen bg-black flex items-center justify-center text-zinc-400">
        Loading profile…
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen text-white bg-black tracking-tight space-y-10">
      <Nav />

      <section className="rounded-xl flex flex-col items-center w-full max-w-3xl px-6 py-8 mx-auto bg-zinc-900">
        <ProfileHeader
          username={username}
          name={name}
          bio={bio}
          profilePicture={profilePicture}
          postsCount={posts.length}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />

        <div className="w-full mt-8">
          {activeTab === "posts" && (
            <Posts
              posts={posts}
              userId={userId}
              profilePicture={profilePicture}
              name={name}
            />
          )}

          {activeTab === "about" && (
            <About
              user={{ username, email, bio, createdAt }}
              postsCount={posts.length}
            />
          )}
        </div>
      </section>
    </main>
  );
};

export default Profile;
