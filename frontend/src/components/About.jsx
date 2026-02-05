import { Mail, Calendar, User } from "lucide-react";
import dayjs from "dayjs";

const About = ({ user, postsCount }) => {
  if (!user) return null;

  const joinedDate = dayjs(user.createdAt).format("MMMM YYYY");

  return (
    <div className="rounded-2xl bg-zinc-800 p-6 space-y-6">
      <h2 className="text-lg font-semibold text-zinc-100 tracking-tight">
        About
      </h2>

      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-zinc-400">
          Bio
        </p>
        <p className="text-zinc-200 leading-relaxed">
          {user.bio || "This user hasn’t added a bio yet."}
        </p>
      </div>

      <div className="space-y-4 pt-2">
        <div className="flex items-center gap-3">
          <User size={18} className="text-zinc-400" />
          <div>
            <p className="text-xs text-zinc-400">Username</p>
            <p className="text-zinc-200">@{user.username}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Mail size={18} className="text-zinc-400" />
          <div>
            <p className="text-xs text-zinc-400">Email</p>
            <p className="text-zinc-200">{user.email}</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Calendar size={18} className="text-zinc-400" />
          <div>
            <p className="text-xs text-zinc-400">Joined</p>
            <p className="text-zinc-200">{joinedDate}</p>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-zinc-700">
        <div className="flex gap-6 text-sm text-zinc-300">
          <p>
            <span className="font-semibold text-zinc-100">
              {postsCount}
            </span>{" "}
            Posts
          </p>
          <p>
            <span className="font-semibold text-zinc-100">0</span>{" "}
            Followers
          </p>
          <p>
            <span className="font-semibold text-zinc-100">0</span>{" "}
            Following
          </p>
        </div>
      </div>
    </div>
  );
};

export default About;
