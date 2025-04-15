import { JSX, useEffect, useState } from "react";
import { FileItem } from "../types/file";
import { useMutation } from "@tanstack/react-query";
import {
  deleteFile,
  deleteFolder,
  moveFile,
  renameItem,
} from "../services/api";
import { MoveModal } from "./MoveModal";
import { LoadingSpinner } from "./LoadingSpinner";
import { toast } from "react-toastify";

interface FileProps {
  item: FileItem;
  onFolderClick: (folder: FileItem) => void;
  onRefresh: () => void;
  parentId: string;
}

export function File({ item, onFolderClick, onRefresh, parentId }: FileProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(item.name);
  const [isMoving, setIsMoving] = useState(false);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (showActions) setShowActions(false);
    };
    document.addEventListener("click", handleClickOutside);
    return () => document.removeEventListener("click", handleClickOutside);
  }, [showActions]);

  const deleteMutation = useMutation({
    mutationFn: () =>
      item.is_folder ? deleteFolder(item._id) : deleteFile(item._id),
    onSuccess: () => {
      toast.success(
        `${item.is_folder ? "Folder" : "File"} deleted successfully`
      );
      onRefresh();
    },
    onError: (error) => {
      toast.error(`Error deleting ${item.is_folder ? "folder" : "file"}`);
      console.error(error);
    },
  });

  const renameMutation = useMutation({
    mutationFn: (newName: string) => renameItem(item._id, newName),
    onSuccess: () => {
      toast.success("Renamed successfully");
      onRefresh();
    },
    onError: (error) => {
      toast.error("Error renaming item");
      console.error(error);
    },
  });

  const moveMutation = useMutation({
    mutationFn: (newParentId: string | null) => moveFile(item._id, newParentId),
    onSuccess: () => {
      toast.success("Item moved successfully");
      onRefresh();
    },
    onError: (error) => {
      toast.error("Error moving item");
      console.error(error);
    },
  });

  const handleRename = () => {
    if (newName.trim() && newName !== item.name) {
      renameMutation.mutate(newName);
    }
    setIsRenaming(false);
  };

  const handleDelete = () => {
    if (
      window.confirm(
        `Are you sure you want to delete this ${
          item.is_folder ? "folder" : "file"
        }?`
      )
    ) {
      deleteMutation.mutate();
    }
  };

  const getFileIcon = () => {
    if (item.is_folder) {
      return (
        <svg
          className="h-5 w-5 text-yellow-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
        </svg>
      );
    }

    const iconsByType: Record<string, JSX.Element> = {
      image: (
        <svg
          className="h-5 w-5 text-green-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
            clipRule="evenodd"
          />
        </svg>
      ),
      pdf: (
        <svg
          className="h-5 w-5 text-red-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
            clipRule="evenodd"
          />
        </svg>
      ),
    };

    const type = item.type.split("/")[0];
    return (
      iconsByType[type] || (
        <svg
          className="h-5 w-5 text-blue-500"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4z"
            clipRule="evenodd"
          />
        </svg>
      )
    );
  };

  const ActionButton = ({
    onClick,
    icon,
    label,
    className = "",
  }: {
    onClick: () => void;
    icon: JSX.Element;
    label: string;
    className?: string;
  }) => (
    <button
      onClick={(e) => {
        e.stopPropagation();
        onClick();
        setShowActions(false);
      }}
      className={`w-full text-left px-4 py-2 text-sm hover:bg-gray-50 flex items-center gap-2 ${className}`}
    >
      {icon}
      {label}
    </button>
  );

  return (
    <div
      className={`group px-4 py-2 hover:bg-gray-50 grid grid-cols-[1fr_8rem_10rem] gap-4 items-center ${
        item.is_folder ? "cursor-pointer" : ""
      }`}
      onClick={() => item.is_folder && onFolderClick(item)}
    >
      <div className="flex items-center gap-3 min-w-0">
        {getFileIcon()}
        {isRenaming ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            onBlur={handleRename}
            onKeyPress={(e) => e.key === "Enter" && handleRename()}
            onClick={(e) => e.stopPropagation()}
            className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
            autoFocus
          />
        ) : (
          <span className="truncate text-sm text-gray-900">{item.name}</span>
        )}
      </div>

      <div className="text-right text-sm text-gray-500">
        {!item.is_folder && `${(item.size / 1024).toFixed(1)} KB`}
      </div>

      <div className="text-right relative">
        <button
          onClick={(e) => {
            e.stopPropagation();
            setShowActions(!showActions);
          }}
          className="opacity-0 group-hover:opacity-100 p-2 hover:bg-gray-100 rounded-full transition-opacity duration-200"
        >
          <svg
            className="h-5 w-5 text-gray-500"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
          </svg>
        </button>

        {showActions && (
          <div className="absolute right-0 mt-1 w-48 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-10 py-1">
            <ActionButton
              onClick={() => {
                setIsRenaming(true);
                setNewName(item.name);
              }}
              icon={
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793z" />
                  <path d="M11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                </svg>
              }
              label="Rename"
            />
            <ActionButton
              onClick={() => setIsMoving(true)}
              icon={
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                </svg>
              }
              label="Move"
            />
            <ActionButton
              onClick={handleDelete}
              icon={
                <svg
                  className="h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zm3 8a1 1 0 11-2 0 1 1 0 012 0zm-4 0a1 1 0 11-2 0 1 1 0 012 0z"
                    clipRule="evenodd"
                  />
                </svg>
              }
              label="Delete"
              className="text-red-600 hover:text-red-700"
            />
          </div>
        )}
      </div>

      {isMoving && (
        <MoveModal
          item={item}
          currentParentId={parentId}
          onMove={(newParentId) => {
            moveMutation.mutate(newParentId);
            setIsMoving(false);
          }}
          onClose={() => setIsMoving(false)}
        />
      )}
    </div>
  );
}
