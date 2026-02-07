import "./App.css";
import { Routes, Route, Link } from "react-router-dom";

import Signin from "./pages/Signin";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Home from "./pages/Home";

const App = () => {
  return (
    <Routes>
      <Route path="/signin" element={<Signin />}></Route>
      <Route path="/profile" element={<Profile />}></Route>
      <Route path="/profile/settings" element={<Settings />}></Route>
      <Route path="/home" element={<Home />}></Route>
    </Routes>
  );
};

export default App;
