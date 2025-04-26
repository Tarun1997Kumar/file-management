import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getFiles } from "../../services/fileApi";
import { BreadcrubItem, FileItem } from "../../types/file";

import { File } from "./File";
import { Fragment, useState } from "react";
import Sidebar from "../shared/SideNavBar";
import { FileUpload } from "./FileUpload";
import { FolderCreate } from "./FolderCreate";
import EmptyState from "./templates/EmptyState";
import LoadingState from "./templates/LoadingState";
import ErrorState from "./templates/ErrorState";
import { AxiosError } from "axios";
import { ErrorResponse } from "../../types/error";

export function FileDashboard() {
  const { parentId } = useParams<{ parentId?: string }>();
  const navigate = useNavigate();
  const [showFolderCreate, setShowFolderCreate] = useState(false);

  const { data, isLoading, error, refetch } = useQuery({
    queryKey: ["files", parentId],
    queryFn: () => getFiles(parentId),
  });

  const handleFolderClick = (folder: FileItem) => {
    navigate(`/file-dashboard/${folder._id}`);
  };

  const currentFolder = data?.currentFolder;
  const files = data?.children;
  const breadcrumbs = (data?.breadcrumbs || []).filter(
    (folder: BreadcrubItem) => folder._id !== parentId
  );

  return (
    <div className="flex h-screen">
      <Sidebar />
      {isLoading ? (
        <LoadingState /> // Loading state component
      ) : error ? (
        <ErrorState
          error={error as AxiosError<ErrorResponse>}
          onRetry={refetch}
        />
      ) : (
        <div className="flex-1 overflow-auto">
          <div className="p-6">
            <div className="max-w-7xl mx-auto">
              <div className="flex flex-wrap gap-4 mb-6">
                <FileUpload parentId={parentId} />
                <FolderCreate
                  parentId={parentId}
                  isOpen={showFolderCreate}
                  onClose={() => setShowFolderCreate(false)}
                />
                <button
                  onClick={() => setShowFolderCreate(true)}
                  className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200"
                >
                  <svg
                    className="mr-2 h-5 w-5"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z"
                    />
                  </svg>
                  New Folder
                </button>
                <button
                  onClick={() => refetch()}
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 cursor-pointer"
                >
                  <svg
                    className="h-4 w-4"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                    />
                  </svg>
                  Refresh
                </button>
              </div>

              <div className="bg-white rounded-lg shadow-sm transition-all duration-200 hover:shadow-md">
                <div className="p-4 border-b border-gray-100">
                  <div className="flex items-center text-sm">
                    <button
                      onClick={() => navigate("/file-dashboard")}
                      className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                    >
                      root
                    </button>
                    {breadcrumbs.map((folder) => (
                      <Fragment key={folder._id}>
                        <span className="mx-2 text-gray-400">/</span>
                        <button
                          onClick={() =>
                            navigate(`/file-dashboard/${folder._id}`)
                          }
                          className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200"
                        >
                          {folder.name}
                        </button>
                      </Fragment>
                    ))}
                    {currentFolder && (
                      <>
                        <span className="mx-2 text-gray-400">/</span>
                        <span className="font-medium text-gray-800">
                          {currentFolder.name}
                        </span>
                      </>
                    )}
                  </div>
                </div>

                <div className="bg-gray-50 text-gray-600 px-6 py-3 grid grid-cols-[1fr_8rem_10rem] gap-4 items-center text-sm font-medium">
                  <div>Name</div>
                  <div className="text-right">Size</div>
                  <div className="text-right">Actions</div>
                </div>

                <div className="divide-y divide-gray-100">
                  {files?.length === 0 ? (
                    <EmptyState />
                  ) : (
                    <div className="animate-fadeIn">
                      {files?.map((item) => (
                        <File
                          item={item}
                          key={item._id}
                          onFolderClick={handleFolderClick}
                          onRefresh={refetch}
                          parentId={parentId!}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
