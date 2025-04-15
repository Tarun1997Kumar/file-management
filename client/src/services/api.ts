// src/services/api.ts
import axios from "axios";
import { CustomFileResponse, FileItem } from "../types/file";

const api = axios.create({
  baseURL: "http://localhost:5000/api", // Replace with your Express server port
});

export const getFiles = async (parentId?: string) => {
  const response = await api.get<CustomFileResponse>(
    `/file${parentId ? `/${parentId}` : "/"}`
  );
  return response.data;
};

export const uploadFile = async (formData: FormData) => {
  const response = await api.post("/file/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data;
};

export const createFolder = async (data: {
  folderName: string;
  parentId?: string;
}) => {
  const response = await api.post("/folder/", data);
  return response.data;
};

export const deleteFile = async (fileId: string) => {
  const response = await api.delete(`/file/${fileId}`);
  return response.data;
};

export const deleteFolder = async (folderId: string) => {
  const response = await api.delete(`/folder/${folderId}`);
  return response.data;
};

export const renameItem = async (fileId: string, newName: string) => {
  const response = await api.patch(`/file/${fileId}/rename`, { newName });
  return response.data;
};

export const moveItem = async (itemId: string, newParentId: string | null) => {
  const response = await api.put(`/file/${itemId}/move`, { newParentId });
  return response.data;
};

export const loginUser = async (data: { email: string; password: string }) => {
  const response = await api.post("/auth/login", data);
  return response.data;
};

export const signupUser = async (data: { email: string; password: string }) => {
  const response = await api.post("/auth/register", data);
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
      localStorage.removeItem("user");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

export const fetchFolders = async (currentParentId: string) => {
  const response = await api.get(`/folder`);

  const rootFolder = {
    _id: null,
    name: "root",
    is_folder: true,
  };
  const folders = response.data?.folders;
  let allFolders = [];
  if (currentParentId) allFolders = [rootFolder, ...folders];
  else allFolders = [folders];
  return allFolders.filter(
    (folder: FileItem) => folder._id !== currentParentId
  );
};
