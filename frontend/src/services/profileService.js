import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

// Get logged-in user profile

export const getProfile = () =>
  axios.get(`${API_URL}/profile`, {
    withCredentials: true,
  });


// Update profile settings
 
export const updateProfileSettings = (formData) =>
  axios.post(`${API_URL}/profile/settings`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
