import "./App.css";
import { Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState, useCallback } from "react";
import axios from "axios";

import Signin from "./pages/Signin";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Home from "./pages/Home";
import Post from "./pages/Post";

import ProtectedRoute from "./components/ProtectedRoute";
import GuestRoute from "./components/GuestRoute";

axios.defaults.withCredentials = true;
axios.defaults.baseURL = import.meta.env.VITE_API_URL || "http://localhost:3000";

const App = () => {
  const [authChecked, setAuthChecked] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Reusable auth checker
  const checkAuth = useCallback(async () => {
    try {
      await axios.get("/profile"); // protected endpoint
      setIsAuthenticated(true);
    } catch {
      setIsAuthenticated(false);
    } finally {
      setAuthChecked(true);
    }
  }, []);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  // Prevent rendering before auth is known
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
            <Signin onAuthSuccess={checkAuth} />
          </GuestRoute>
        }
      />

      {/* Protected routes */}
      <Route
        path="/home"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Home onLogout={checkAuth} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Profile onLogout={checkAuth} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/profile/settings"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Settings onLogout={checkAuth} />
          </ProtectedRoute>
        }
      />

      <Route
        path="/post/:id"
        element={
          <ProtectedRoute isAuthenticated={isAuthenticated}>
            <Post onLogout={checkAuth} />
          </ProtectedRoute>
        }
      />

      {/* fallback */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
};

export default App;
