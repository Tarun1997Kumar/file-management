import { useEffect, useState } from "react";
import { FileItem } from "../types/file";
import { useMutation } from "@tanstack/react-query";
import {
  deleteFile,
  deleteFolder,
  moveItem,
  renameItem,
} from "../services/api";
import { MoveModal } from "./MoveModal";

export function File({
  item,
  onFolderClick,
  onRefresh,
}: {
  item: FileItem;
  onFolderClick: (folder: FileItem) => void;
  onRefresh: () => void;
}) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [newName, setNewName] = useState(item.name);
  const [isMoving, setIsMoving] = useState(false);
  const [showActions, setShowActions] = useState(false);

  useEffect(() => {
    const abort = new AbortController();
    const handleClickOutside = (e: MouseEvent) => {
      if (showActions) setShowActions(false);
    };

    document.addEventListener("click", handleClickOutside);
    abort.abort();
  }, [showActions]);

  const deleteMutation = useMutation({
    mutationFn: () =>
      item.is_folder ? deleteFolder(item._id) : deleteFile(item._id),
    onSuccess: () => {
      onRefresh();
    },
    onError: (error) => {
      console.error(error); // Display toast
    },
  });

  const renameMutation = useMutation({
    mutationFn: (newName: string) => renameItem(item._id, newName),
    onSuccess: () => {
      onRefresh();
    },
    onError: (error) => {
      console.error(error); // Display toast
    },
  });

  const moveMutation = useMutation({
    mutationFn: (newParentId: string | null) => moveItem(item._id, newParentId),
    onSuccess: () => {
      onRefresh();
    },
    onError: (error) => {
      console.error(error); // Display toast
    },
  });

  const handleRename = () => {
    if (newName.trim() != "" && newName != item.name) {
      renameMutation.mutate(newName);
    }
    setIsRenaming(false);
  };

  const handleDelete = () => {
    deleteMutation.mutate();
  };

  const handleMove = (newParentId: string | null) => {
    moveMutation.mutate(newParentId);
  };

  return (
    <div
      className="p-2 rounded cursor-pointer hover:bg-gray-100 grid grid-cols-[1fr_8rem_10rem] gap-4 items-center"
      onClick={() => item.is_folder && onFolderClick(item)}
    >
      {/* Name Column */}
      <div className="flex items-center space-x-2 truncate">
        {isRenaming ? (
          <input
            type="text"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            className="p-1 rounded shadow w-full"
            onBlur={handleRename}
            onClick={(e) => e.stopPropagation()}
            autoFocus={isRenaming}
          />
        ) : (
          <div className="flex items-center space-x-2 truncate">
            <span>{item.is_folder ? "📁" : "📄"}</span>
            <span className="truncate">{item.name}</span>
          </div>
        )}
      </div>

      {/* Size Column */}
      <div className="text-sm text-gray-600 text-right pr-4">
        {!item.is_folder && `${(item.size / 1024).toFixed(2)} KB`}
      </div>

      {/* Actions Column */}
      <div className="text-right relative">
        <div className="flex justify-end">
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowActions(!showActions);
            }}
            className="p-1 hover:bg-gray-200 rounded-full"
          >
            {/* Heroicons ellipsis-vertical icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-5 h-5"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z"
              />
            </svg>
          </button>
        </div>

        {/* Dropdown Menu */}
        {showActions && (
          <div
            className="absolute right-0 mt-2 w-32 bg-white border border-gray-200 rounded-md shadow-lg z-10"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsRenaming(true);
                setNewName(item.name);
                setShowActions(false);
              }}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                />
              </svg>
              Rename
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsMoving(true);
                setShowActions(false);
              }}
              className="w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M15.75 9V5.25A2.25 2.25 0 0013.5 3h-6a2.25 2.25 0 00-2.25 2.25v13.5A2.25 2.25 0 007.5 21h6a2.25 2.25 0 002.25-2.25V15m3 0l3-3m0 0l-3-3m3 3H9"
                />
              </svg>
              Move
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                handleDelete();
                setShowActions(false);
              }}
              className="w-full px-4 py-2 text-sm text-red-600 hover:bg-gray-100 flex items-center gap-2"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="w-4 h-4"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                />
              </svg>
              Delete
            </button>
          </div>
        )}
      </div>

      {isMoving && (
        <MoveModal
          item={item}
          onMove={handleMove}
          onClose={() => setIsMoving(false)}
        />
      )}
    </div>
  );
}
