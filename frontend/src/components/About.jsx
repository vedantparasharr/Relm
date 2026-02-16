import { Mail, Calendar, User } from "lucide-react";
import dayjs from "dayjs";

const About = ({ user, postsCount }) => {
  /* ---------------------------- GUARD ------------------------------- */
  if (!user) return null;

  /* ------------------------- DERIVED VALUES ------------------------- */
  const joinedDate = dayjs(user.createdAt).format("MMMM YYYY");

  /* ------------------------------- UI ------------------------------- */
  return (
    <div className="rounded-2xl bg-zinc-800 p-6 space-y-6">

      {/* Title */}
      <h2 className="text-lg font-semibold text-zinc-100 tracking-tight">
        About
      </h2>

      {/* Bio */}
      <div className="space-y-1">
        <p className="text-xs uppercase tracking-wide text-zinc-400">Bio</p>
        <p className="text-zinc-200 leading-relaxed">
          {user.bio || "This user hasn’t added a bio yet."}
        </p>
      </div>

      {/* Details */}
      <div className="space-y-4 pt-2">
        <InfoRow icon={<User size={18} className="text-zinc-400" />} label="Username">
          @{user.username}
        </InfoRow>

        <InfoRow icon={<Mail size={18} className="text-zinc-400" />} label="Email">
          {user.email}
        </InfoRow>

        <InfoRow icon={<Calendar size={18} className="text-zinc-400" />} label="Joined">
          {joinedDate}
        </InfoRow>
      </div>

      {/* Stats */}
      <div className="pt-4 border-t border-zinc-700">
        <div className="flex gap-6 text-sm text-zinc-300">
          <p>
            <span className="font-semibold text-zinc-100">{postsCount}</span>{" "}
            Posts
          </p>
          <p>
            <span className="font-semibold text-zinc-100">0</span> Followers
          </p>
          <p>
            <span className="font-semibold text-zinc-100">0</span> Following
          </p>
        </div>
      </div>
    </div>
  );
};

/* ---------------------------- INFO ROW ----------------------------- */
const InfoRow = ({ icon, label, children }) => (
  <div className="flex items-center gap-3">
    {icon}
    <div>
      <p className="text-xs text-zinc-400">{label}</p>
      <p className="text-zinc-200">{children}</p>
    </div>
  </div>
);

export default About;
