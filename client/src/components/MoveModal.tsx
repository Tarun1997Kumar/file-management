import { Fragment, useEffect } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { getFiles, moveFile } from "../services/api";
import { FileItem } from "../types/file";
import { LoadingSpinner } from "./LoadingSpinner";
import { toast } from "react-toastify";

interface MoveModalProps {
  isOpen: boolean;
  onClose: () => void;
  fileToMove: FileItem;
  currentFolderId?: string;
}

export function MoveModal({
  isOpen,
  onClose,
  fileToMove,
  currentFolderId,
}: MoveModalProps) {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["files", currentFolderId],
    queryFn: () => getFiles(currentFolderId),
    enabled: isOpen,
  });

  const moveMutation = useMutation({
    mutationFn: (targetId: string) =>
      moveFile(fileToMove._id, targetId || null),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      toast.success("File moved successfully");
      onClose();
    },
    onError: () => {
      toast.error("Failed to move file");
    },
  });

  // Close modal on Escape key press
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  const folders = data?.children?.filter((item) => item.is_folder) || [];
  const breadcrumbs = data?.breadcrumbs || [];

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-center justify-center p-4 text-center">
        <div
          className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"
          onClick={onClose}
        />

        <div className="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:w-full sm:max-w-lg animate-slideUp">
          <div className="bg-white px-4 pb-4 pt-5 sm:p-6">
            <div className="sm:flex sm:items-start">
              <div className="mt-3 w-full text-left sm:ml-4 sm:mt-0">
                <h3 className="text-lg font-medium leading-6 text-gray-900">
                  Move {fileToMove.name}
                </h3>
                <div className="mt-6">
                  {isLoading ? (
                    <div className="flex justify-center py-8">
                      <LoadingSpinner size="lg" color="blue" />
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="flex items-center text-sm">
                        <button
                          onClick={() => moveMutation.mutate("")}
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                        >
                          root
                        </button>
                        {breadcrumbs.map((folder) => (
                          <Fragment key={folder._id}>
                            <span className="mx-2 text-gray-400">/</span>
                            <button
                              onClick={() => moveMutation.mutate(folder._id)}
                              className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                            >
                              {folder.name}
                            </button>
                          </Fragment>
                        ))}
                      </div>

                      <div className="max-h-60 overflow-y-auto rounded-md border border-gray-200">
                        {folders.length === 0 ? (
                          <div className="px-4 py-8 text-center text-sm text-gray-500">
                            No folders available
                          </div>
                        ) : (
                          <ul className="divide-y divide-gray-200">
                            {folders.map((folder) => (
                              <li
                                key={folder._id}
                                className="px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                              >
                                <button
                                  onClick={() =>
                                    moveMutation.mutate(folder._id)
                                  }
                                  className="flex w-full items-center text-left"
                                  disabled={folder._id === fileToMove._id}
                                >
                                  <svg
                                    className="mr-3 h-5 w-5 text-gray-400"
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20"
                                    fill="currentColor"
                                  >
                                    <path
                                      fillRule="evenodd"
                                      d="M2 6a2 2 0 012-2h4l2 2h4a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6z"
                                      clipRule="evenodd"
                                    />
                                  </svg>
                                  <span className="flex-1 text-sm text-gray-900">
                                    {folder.name}
                                  </span>
                                </button>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button
              type="button"
              onClick={onClose}
              className="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto transition-colors duration-200"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
