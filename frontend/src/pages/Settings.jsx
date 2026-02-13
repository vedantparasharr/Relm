import React, { useEffect, useState } from "react";
import Nav from "../components/Nav";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const Settings = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // Display values (for header - only update on save)
  const [displayName, setDisplayName] = useState("");
  const [displayUsername, setDisplayUsername] = useState("");
  const [displayBio, setDisplayBio] = useState("");
  const [displayImage, setDisplayImage] = useState("");

  // Form values (what user is editing)
  const [name, setName] = useState("");
  const [username, setUsername] = useState("");
  const [bio, setBio] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [email, setEmail] = useState("");
  const [imageFile, setImageFile] = useState(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await axios.get("http://localhost:3000/profile", {
          withCredentials: true,
        });
        setUser(res.data.user);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    if (user) {
      // Set both display and form values initially
      const userName = user.name || "";
      const userUsername = user.username || "";
      const userBio = user.bio || "";
      const userImage = user.image || "/default-avatar.png";

      // Display values
      setDisplayName(userName);
      setDisplayUsername(userUsername);
      setDisplayBio(userBio);
      setDisplayImage(userImage);

      // Form values
      setName(userName);
      setUsername(userUsername);
      setEmail(user.email || "");
      setBio(userBio);

      // Convert ISO date to yyyy-MM-dd format
      if (user.dateOfBirth) {
        const date = new Date(user.dateOfBirth);
        const formattedDate = date.toISOString().split("T")[0];
        setDateOfBirth(formattedDate);
      }
    }
  }, [user]);

  const handleSubmission = async () => {
    try {
      const formData = new FormData();

      formData.append("name", name);
      formData.append("username", username);
      formData.append("bio", bio);
      formData.append("dateOfBirth", dateOfBirth);
      formData.append("currentPassword", currentPassword);
      formData.append("newPassword", newPassword);
      formData.append("confirmPassword", confirmPassword);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const res = await axios.post(
        "http://localhost:3000/profile/settings",
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        },
      );
      
      // Update display values only after successful save
      setDisplayName(res.data.user.name);
      setDisplayUsername(res.data.user.username);
      setDisplayBio(res.data.user.bio);
      setDisplayImage(res.data.user.image);

      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      setImageFile(null);

      navigate("/profile");
    } catch (err) {
      console.error(err);
      alert("Failed to save settings");
    }
  };

  const handleCancel = () => {
    // Reset form values to display values (undo changes)
    setName(displayName);
    setUsername(displayUsername);
    setBio(displayBio);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-black flex items-center justify-center text-zinc-400">
        Loading...
      </main>
    );
  }

  return (
    <main className="flex flex-col min-h-screen bg-black text-white tracking-tight space-y-10 pb-10">
      <Nav />

      <section className="max-w-3xl mx-auto w-full bg-zinc-900 rounded-xl">
        <div className="p-6 border-b border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <div className="relative">
                <img
                  src={displayImage}
                  alt="avatar"
                  className="h-20 w-20 rounded-full object-cover ring-2 ring-zinc-700"
                />

                <label className="absolute bottom-0 right-0 bg-zinc-800 text-xs px-2 py-1 rounded cursor-pointer">
                  Edit
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (!file) return;

                      setImageFile(file);

                      // preview immediately
                      setDisplayImage(URL.createObjectURL(file));
                    }}
                  />
                </label>
              </div>

              <div className="flex flex-col">
                <span className="text-lg font-semibold text-zinc-100">
                  {displayName || "User Name"}
                </span>
                <span className="text-sm text-zinc-400">
                  @{displayUsername || "username"}
                </span>
                <span className="mt-2 text-sm text-zinc-300 max-w-xs leading-snug">
                  {displayBio ||
                    "This user prefers to keep an air of mystery about them."}
                </span>
              </div>
            </div>

            <button
              onClick={handleCancel}
              className="text-sm text-zinc-400 border border-zinc-600 py-2 px-3 rounded-md hover:text-zinc-200 hover:border-zinc-500 transition"
            >
              Cancel
            </button>
          </div>
        </div>

        <div className="p-6 my-2 space-y-4">
          <h2 className="text-xl font-medium tracking-tight text-zinc-100">
            Account Settings
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Full name</label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                type="text"
                className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 outline-none focus:border-blue-400 transition"
              />
            </div>

            <div className="flex flex-col gap-1">
              <label className="text-sm text-zinc-400">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 outline-none focus:border-blue-400 transition"
              />
            </div>
          </div>

          <div className="flex gap-4">
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm text-zinc-400">Email</label>
              <input
                type="email"
                value={email}
                disabled
                className="bg-zinc-800/60 border border-zinc-700 rounded-md px-3 py-2 text-zinc-400 cursor-not-allowed"
              />
              <p className="text-xs text-zinc-500">
                Email changes require verification.
              </p>
            </div>
            <div className="flex flex-col gap-1 w-full">
              <label className="text-sm text-zinc-400">Date of Birth</label>
              <input
                value={dateOfBirth}
                onChange={(e) => setDateOfBirth(e.target.value)}
                type="date"
                className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 text-zinc-200 outline-none focus:border-blue-400 transition"
              />
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm text-zinc-400">Bio</label>
            <textarea
              value={bio}
              onChange={(e) => setBio(e.target.value)}
              rows={3}
              maxLength={120}
              className="bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 resize-none outline-none focus:border-blue-400 transition"
            />
            <p className="text-xs text-zinc-500 text-right">
              {bio.length} / 120
            </p>
          </div>

          <div className="border-t border-zinc-800 pt-6 space-y-4">
            <h3 className="text-sm font-medium text-zinc-300">
              Change password
            </h3>

            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="Current password"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 outline-none focus:border-blue-400 transition"
            />

            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="New password"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 outline-none focus:border-blue-400 transition"
            />

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm new password"
              className="w-full bg-zinc-800 border border-zinc-700 rounded-md px-3 py-2 outline-none focus:border-blue-400 transition"
            />
          </div>

          <div className="flex items-center justify-between pt-6">
            <button
              onClick={handleSubmission}
              className="bg-blue-600 hover:bg-blue-500 transition px-6 py-2 rounded-md font-medium"
            >
              Save changes
            </button>
          </div>
        </div>
      </section>
    </main>
  );
};

export default Settings;
