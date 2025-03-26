// src/types.ts
export interface FileItem {
  _id: string;
  name: string;
  size: number;
  path: string;
  type: string;
  is_folder: boolean;
  userId: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface BreadcrubItem {
  _id: string;
  name: string;
  parentId: string | null;
}
export interface CustomFileResponse {
  currentFolder: FileItem;
  children: FileItem[];
  breadcrumbs: BreadcrubItem[];
}
