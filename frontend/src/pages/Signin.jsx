import React from "react";
import { Link } from "react-router-dom";

const Signin = () => {
  return (
    <main className="min-h-screen max-w-7xl flex justify-center gap-4 items-center mx-auto">
      <div className="hidden lg:flex items-center justify-center w-[520px] overflow-hidden">
        <img
          src="/hero.png"
          alt="Relm blogging illustration"
          className="w-full max-w-[520px] object-contain opacity-90"
        />
      </div>
      <section className="bg-zinc-900 text-white flex flex-col min-w-md p-8 rounded-xl tracking-tight ">
        <div className="flex items-center overflow-hidden justify-center min-h-32 mb-8">
          <img className="w-48" src="/logo-dark.png" alt="relm logo" />
        </div>
        <form action="/auth/signin" className="space-y-4">
          <div className="flex flex-col gap-2">
            <label className="text-sm" htmlFor="email">
              Email
            </label>
            <input
              className="px-3 py-2 text-sm placeholder-zinc-400 bg-zinc-900/40 border border-zinc-700 rounded-md zinc-800 outline-none focus:ring-2 focus:ring-blue-500"
              type="text"
              name="email"
              id="email"
              placeholder="you@example.com"
            />
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-sm" htmlFor="email">
              Password
            </label>
            <input
              className="px-3 py-2 text-sm placeholder-zinc-400 bg-zinc-900/40 border border-zinc-700 rounded-md zinc-800 outline-none focus:ring-2 focus:ring-blue-500"
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
            />
          </div>
          <div className="flex justify-between">
            <div className="flex items-center gap-1">
              <input type="checkbox" name="remember" id="remember" />
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
            <button className="flex justify-center min-w-full bg-blue-600 py-2 mt-4 px-4 rounded-md font-medium text-sm">
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
