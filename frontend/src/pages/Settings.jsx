import React from "react";
import Nav from "../components/Nav";
import ProfileHeader from "../components/ProfileHeader";

const Settings = () => {
  return (
    <>
      <main className="flex flex-col min-h-screen bg-black text-white tracking-tight space-y-10">
        <Nav></Nav>
        <section className="max-w-4xl px-6 py-8 mx-auto bg-zinc-900 items-center w-full flex flex-col rounded-xl">
          <ProfileHeader />
        </section>
      </main>
    </>
  );
};

export default Settings;
