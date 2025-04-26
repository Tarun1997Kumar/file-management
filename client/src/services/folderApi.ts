import api from "./api";
import { FileItem } from "../types/file";

export const createFolder = async (data: {
  folderName: string;
  parentId?: string;
}) => {
  const response = await api.post("/folder/", data);
  return response.data;
};

export const deleteFolder = async (folderId: string) => {
  const response = await api.delete(`/folder/${folderId}`);
  return response.data;
};

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
