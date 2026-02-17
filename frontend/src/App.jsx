import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

import Signin from "./pages/Signin";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Home from "./pages/Home";
import Post from "./pages/Post";

import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

const App = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  axios.defaults.withCredentials = true;

  useEffect(() => {
    const checkAuth = async () => {
      try {
        // endpoint that requires login
        await axios.get("/profile");
        setIsAuthenticated(true);
      } catch (err) {
        setIsAuthenticated(false);
      } finally {
        setAuthChecked(true);
      }
    };

    checkAuth();
  }, []);

  // Prevent routes rendering before auth check
  if (!authChecked) {
    return <div>Loading...</div>;
  }

  return (
    <Routes>
      {/* Smart entry route */}
      <Route
        path="/"
        element={
          isAuthenticated ? (
            <Navigate to="/home" replace />
          ) : (
            <Navigate to="/signin" replace />
          )
        }
      />

      {/* Guest-only route */}
      <Route
        path="/signin"
        element={
          <GuestRoute isAuthenticated={isAuthenticated}>
            <Signin />
          </GuestRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Home />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Profile />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/settings"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Settings />
          </ProtectedRoute>
        }
      />

      <Route
        path="/post/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Post />
          </ProtectedRoute>
        }
      />

      {/* Fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
