import axios from "axios";

const API = "http://localhost:3000";


// Get logged-in user profile

export const getProfile = () =>
  axios.get(`${API}/profile`, {
    withCredentials: true,
  });


// Update profile settings
 
export const updateProfileSettings = (formData) =>
  axios.post(`${API}/profile/settings`, formData, {
    withCredentials: true,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
