import "./App.css";
import { Routes, Route, Link } from "react-router-dom";

import Signin from "./pages/Signin";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Home from "./pages/Home";
import Post from "./pages/Post";

const App = () => {
  return (
    <Routes>
      <Route path="/signin" element={<Signin />}></Route>
      <Route path="/profile" element={<Profile />}></Route>
      <Route path="/profile/settings" element={<Settings />}></Route>
      <Route path="/home" element={<Home />}></Route>
      <Route path="/post/:id" element={<Post />}></Route>
    </Routes>
  );
};

export default App;
