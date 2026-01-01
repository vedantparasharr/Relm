import "./App.css";
import { Routes, Route, Link } from "react-router-dom";

import Signin from "./pages/Signin";
import Profile from "./pages/Profile";

const App = () => {
  return (
    <Routes>
      <Route path="/signin" element={<Signin />}></Route>
      <Route path="/profile" element={<Profile />}></Route>
    </Routes>
  );
};

export default App;
