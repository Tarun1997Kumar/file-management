// src/services/api.ts
import axios from "axios";
import { User } from "../types/user";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with your Express server port
});

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await api.post<User>("/auth/login", data);
  return response.data;
};

export const signupUser = async (data: { email: string; password: string }) => {
  const response = await api.post<User>("/auth/register", data);
  return response.data;
};

api.interceptors.request.use((config) => {
  const user = JSON.parse(localStorage.getItem("user") || "null");
  if (user?.token) {
    config.headers.Authorization = `Bearer ${user.token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.dispatchEvent(new Event("unauthorized"));
    }
    return Promise.reject(error);
  }
);

export default api;
