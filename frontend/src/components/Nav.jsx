import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useRef } from "react";
import axios from "axios";

const Nav = () => {
  const [profilePicture, setProfilePicture] = useState("/default-avatar.png");
  const [open, setOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const fetchProfile = async () => {
      const res = await axios.get("http://localhost:3000/profile", {
        withCredentials: true,
      });
      setProfilePicture(res.data.user.image);
    };
    fetchProfile();
  }, []);

  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navigate = useNavigate();
  const handleLogout = async () => {
    try {
      await axios.get("http://localhost:3000/auth/signout", {
        withCredentials: true,
      });
      navigate("/signin");
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <nav className="sticky top-0 z-50 border-b border-neutral-900 bg-black/80 backdrop-blur-md">
      <div className="max-w-2xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link to={"/home"}>
          {" "}
          <img className="h-14" src="/logo-dark.png" alt="Logo" />
        </Link>
        <div className="flex gap-4 text-sm font-medium text-neutral-400">
          <Link to={"/home"} className="text-white">
            For You
          </Link>
          <button>Following</button>
        </div>

        <div ref={menuRef} className="relative">
          <button
            onClick={() => setOpen((p) => !p)}
            className="w-8 h-8 rounded-full overflow-hidden bg-neutral-800"
          >
            <img src={profilePicture} className="h-8 w-8" alt="Profile" />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 w-44 rounded-xl border border-neutral-800 bg-black shadow-xl">
              <Link
                to="/profile"
                className="block px-4 py-2 text-sm hover:bg-neutral-900"
                onClick={() => setOpen(false)}
              >
                View Profile
              </Link>

              <button
                onClick={handleLogout}
                className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-neutral-900"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
