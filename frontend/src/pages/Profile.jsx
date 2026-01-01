import React from "react";
import { Link } from "react-router-dom";

const Profile = () => {
  return (
    <main className="flex flex-col min-h-screen text-white bg-black tracking-tight space-y-10">
      <nav className="py-4 px-6 border-b border-zinc-800">
        <div className="flex items-center justify-between overflow-hidden h-8">
          <Link to="/home">
            <img src="/logo-dark.png" className="h-20" alt="" />
          </Link>
        </div>
      </nav>

      <section className="rounded-xl flex flex-col items-center w-full max-w-3xl px-6 py-8 mx-auto bg-zinc-900">
        <div className="flex items-start gap-8 pb-8 w-full">
          <div className="h-40 w-40 rounded-full overflow-hidden shrink-0">
            <img
              src="/default-avatar.png"
              alt="default avatar"
              className="h-full w-full object-cover"
            />
          </div>

          <div className="flex-1">
            <p className="font-semibold text-2xl text-zinc-200">
              Vedant Parashar
            </p>
            <h3 className="font-medium text-zinc-500 mt-0.5">@vedant</h3>

            <div className="flex gap-6 text-sm text-zinc-300 mt-4">
              <p>
                <span className="font-semibold">0</span> Posts
              </p>
              <p>
                <span className="font-semibold">0</span> Followers
              </p>
              <p>
                <span className="font-semibold">0</span> Following
              </p>
            </div>

            <p className="text-zinc-300 max-w-xl mt-5 leading-relaxed">
              Lorem ipsum dolor sit amet consectetur, adipisicing elit. Ducimus
              velit officiis consectetur commodi aliquid veniam, error laborum
              ex corporis.
            </p>
          </div>
        </div>
        <div className="flex w-full gap-4 justify-between" >
          <button className="py-4 px-6 font-medium w-full hover:opacity-80 bg-zinc-800 rounded-xl " >Edit Profile</button>
          <button className="py-4 px-6 font-medium w-full hover:opacity-90 bg-zinc-800 rounded-xl">Settings</button>
        </div>
      </section>
    </main>
  );
};

export default Profile;
