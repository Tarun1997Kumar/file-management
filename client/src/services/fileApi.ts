import api from "./api";
import { CustomFileResponse } from "../types/file";

export const getFiles = async (parentId?: string) => {
  const response = await api.get<CustomFileResponse>(
    `/file${parentId ? `/${parentId}` : "/"}`
  );
  return response.data;
};

export const uploadFile = async (
  formData: FormData,
  onProgress?: (progress: number) => void
) => {
  const response = await api.post("/file/upload", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (event) => {
      if (onProgress && event.total) {
        const percentCompleted = (event.loaded * 100) / event.total;
        onProgress(percentCompleted);
      }
    },
  });
  return response.data;
};

export const deleteFile = async (fileId: string) => {
  const response = await api.delete(`/file/${fileId}`);
  return response.data;
};

export const renameItem = async (fileId: string, newName: string) => {
  const response = await api.patch(`/file/${fileId}/rename`, { newName });
  return response.data;
};

export const moveFile = async (itemId: string, newParentId: string | null) => {
  const response = await api.put(`/file/${itemId}/move`, { newParentId });
  return response.data;
};
