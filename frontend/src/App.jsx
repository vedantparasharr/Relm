import "./App.css";
import { Routes, Route, Link, Navigate } from "react-router-dom";

import Signin from "./pages/Signin";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Home from "./pages/Home";
import Post from "./pages/Post";
import ProtectedRoute from "./components/ProtectedRoute";

const App = () => {
const isAuthenticated = !!localStorage.getItem("token");

  return (
    <Routes>
      <Route
        path="/"
        element={
          isAuthenticated
            ? <Navigate to="/home" replace />
            : <Navigate to="/signin" replace />
        }
      />

      <Route path="/signin" element={<Signin />} />
      <Route
        path="/home"
        element={
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route path="/profile/settings" element={<Settings />} />
      <Route path="/post/:id" element={<Post />} />
    </Routes>
  );
};


export default App;
