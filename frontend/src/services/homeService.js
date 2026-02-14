import axios from "axios";

const API = "http://localhost:3000";

export const getProfile = () =>
  axios.get(`${API}/profile`, { withCredentials: true });

export const getPosts = () =>
  axios.get(`${API}/home`, { withCredentials: true });

export const createPost = (content) =>
  axios.post(
    `${API}/posts/`,
    { content },
    { withCredentials: true }
  );