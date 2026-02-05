import React from "react";
import { Link } from "react-router-dom";

const Nav = () => {
  return (
    <nav className="py-4 px-6 border-b border-zinc-800">
      <div className="flex items-center justify-between overflow-hidden h-8">
        <Link to="/home">
          <img src="/logo-dark.png" className="h-20" alt="" />
        </Link>
      </div>
    </nav>
  );
};

export default Nav;
