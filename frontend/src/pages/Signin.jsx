import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const Signin = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post(
        "http://localhost:3000/auth/signin",
        {
          email,
          password,
          remember,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res);
      navigate("/home");
    } catch (error) {
      const data = error.response?.data;
      
      if (data?.next === "verify") {
        navigate(`/verify-email/${data.userId}`);
      } else {
        setError(data?.message || "Signin failed");
      }
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center px-4">
      <div className="hidden lg:flex items-center justify-center w-[520px] overflow-hidden">
        <img
          src="/hero.png"
          alt="Relm blogging illustration"
          className="w-full max-w-[520px] object-contain opacity-90"
        />
      </div>
      <section className="bg-zinc-900 text-white w-full max-w-md p-6 sm:p-8 rounded-xl">
        <div className="flex items-center overflow-hidden justify-center min-h-32 mb-8">
          <img className="w-48" src="/logo-dark.png" alt="relm logo" />
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm " htmlFor="email">
              Email
            </label>
            <input
              className="w-full px-3 py-2 text-sm placeholder-zinc-400 bg-zinc-900/40 border border-zinc-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm" htmlFor="email">
              Password
            </label>
            <input
              className="w-full px-3 py-2 text-sm placeholder-zinc-400 bg-zinc-900/40 border border-zinc-700 rounded-md outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
              value={password}
              type="password"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-1">
              <input
                type="checkbox"
                name="remember"
                id="remember"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
              />
              <label htmlFor="remember" className="text-sm text-zinc-300">
                Remember me
              </label>
            </div>
            <div>
              <Link
                to="/auth/forget"
                className="text-sm text-blue-400 hover:underline"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          <div>
            <button className="flex justify-center w-full bg-blue-600 py-2.5 mt-4 px-4 rounded-md font-medium text-sm">
              Sign in
            </button>
          </div>
          <div className="flex justify-center text-xs text-zinc-400">
            <p>
              Don't have an account?{" "}
              <Link to="/auth/signup" className="text-blue-400 hover:underline">
                Create one
              </Link>
            </p>
          </div>
        </form>
      </section>
    </main>
  );
};

export default Signin;
