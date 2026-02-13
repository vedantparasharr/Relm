import React, { useState } from "react";
import axios from "axios";
import {
  Eye,
  EyeOff,
  ArrowRight,
  Loader2,
  Sparkles,
  CheckCircle2,
} from "lucide-react";

const Auth = () => {
  // View states: 'login' | 'register' | 'verify'
  const [view, setView] = useState("login");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Data states
  const [userId, setUserId] = useState(null);
  const [otp, setOtp] = useState("");

  const [formData, setFormData] = useState({
    email: "",
    password: "",
    username: "",
    name: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      let res;
      if (view === "verify") {
        res = await axios.post(
          "http://localhost:3000/auth/verify-email",
          {
            userId: userId,
            code: otp,
          },
          { withCredentials: true },
        );

        if (res.status === 200) {
          window.location.href = "/home";
          return;
        }
      } else {
        const endpoint =
          view === "login"
            ? "http://localhost:3000/auth/signin"
            : "http://localhost:3000/auth/signup";

        const payload =
          view === "login"
            ? { email: formData.email, password: formData.password }
            : formData;

        res = await axios.post(endpoint, payload, { withCredentials: true });

        // Handle success response
        if (res.data.next === "verify") {
          setUserId(res.data.userId || res.data.user); // Capture User ID
          setView("verify"); // Switch UI to Verify Mode
        } else {
          window.location.href = "/home";
        }
      }
    } catch (err) {
      console.error(err);
      setError(
        err.response?.data?.message ||
          err.response?.data ||
          "Something went wrong. Please try again.",
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-neutral-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center mb-4 shadow-[0_0_15px_rgba(255,255,255,0.3)]">
            {view === "verify" ? (
              <CheckCircle2 className="text-black" size={24} />
            ) : (
              <Sparkles className="text-black" size={24} />
            )}
          </div>
          <h1 className="text-2xl font-bold tracking-tight">
            {view === "login" && "Welcome back"}
            {view === "register" && "Create your account"}
            {view === "verify" && "Check your email"}
          </h1>
          <p className="text-neutral-500 mt-2 text-sm text-center">
            {view === "login" && "Enter your details to access your feed."}
            {view === "register" &&
              "Join the community and share your thoughts."}
            {view === "verify" && `We've sent a code to ${formData.email}.`}
          </p>
        </div>

        {/* Main Form Card */}
        <div className="bg-neutral-900/50 border border-neutral-800 rounded-xl p-6 sm:p-8 backdrop-blur-sm shadow-xl">
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {/* --- VERIFICATION VIEW --- */}
            {view === "verify" && (
              <div className="space-y-1">
                <label className="text-xs font-medium text-neutral-400 ml-1">
                  Verification Code
                </label>
                <input
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="Enter OTP"
                  className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-all text-center tracking-widest text-lg"
                  autoFocus
                />
              </div>
            )}

            {/* --- LOGIN / REGISTER VIEW --- */}
            {view !== "verify" && (
              <>
                {/* Register-only Fields */}
                {view === "register" && (
                  <>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-400 ml-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Jane Doe"
                        className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-xs font-medium text-neutral-400 ml-1">
                        Username
                      </label>
                      <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        placeholder="@janedoe"
                        className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all"
                      />
                    </div>
                  </>
                )}

                {/* Common Fields */}
                <div className="space-y-1">
                  <label className="text-xs font-medium text-neutral-400 ml-1">
                    Email
                  </label>
                  <input
                    type="email"
                    name="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    placeholder="name@example.com"
                    className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all"
                  />
                </div>

                <div className="space-y-1 relative">
                  <label className="text-xs font-medium text-neutral-400 ml-1">
                    Password
                  </label>
                  <div className="relative">
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      placeholder="••••••••"
                      className="w-full bg-black border border-neutral-800 rounded-lg px-4 py-3 text-white placeholder-neutral-600 focus:outline-none focus:border-neutral-600 focus:ring-1 focus:ring-neutral-600 transition-all pr-10"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>
              </>
            )}

            {/* Error Message */}
            {error && (
              <div className="text-red-400 text-sm bg-red-900/10 border border-red-900/50 p-3 rounded-lg text-center animate-pulse">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              disabled={loading}
              type="submit"
              className="mt-2 w-full bg-white text-black font-bold rounded-full py-3 hover:bg-neutral-200 transition-colors disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              {loading ? (
                <Loader2 size={20} className="animate-spin" />
              ) : (
                <>
                  {view === "login" && "Sign In"}
                  {view === "register" && "Create Account"}
                  {view === "verify" && "Verify Email"}
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Footer / Toggle */}
        <div className="mt-8 text-center text-sm text-neutral-500">
          {view === "verify" ? (
            <button
              onClick={() => setView("login")}
              className="text-white font-medium hover:underline focus:outline-none"
            >
              ← Back to Login
            </button>
          ) : (
            <>
              {view === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={() => {
                  setView(view === "login" ? "register" : "login");
                  setError("");
                  setFormData({
                    email: "",
                    password: "",
                    username: "",
                    name: "",
                  });
                }}
                className="text-white font-medium hover:underline focus:outline-none"
              >
                {view === "login" ? "Sign up" : "Log in"}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
