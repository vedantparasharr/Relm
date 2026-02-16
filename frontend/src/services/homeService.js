import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

export const getProfile = () =>
  axios.get(`${API_URL}/profile`, { withCredentials: true });

export const getPosts = () =>
  axios.get(`${API_URL}/home`, { withCredentials: true });

export const createPost = (content) =>
  axios.post(
    `${API_URL}/posts/`,
    { content },
    { withCredentials: true }
  );