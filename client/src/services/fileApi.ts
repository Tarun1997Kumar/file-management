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

export const downloadFile = async (filePath: string) => {
  const response = await api.get(
    `/file/download?filePath=${encodeURIComponent(filePath)}`,
    {
      responseType: "blob", // Important if you want to download file data
    }
  );
  // const url = window.URL.createObjectURL(new Blob([response.data]));
  // const link = document.createElement("a");
  // link.href = url;
  // link.setAttribute("download", filePath.split("/").pop()!); // get file name from path
  // document.body.appendChild(link);
  // link.click();
  // link.remove();
  return response.data;
};
