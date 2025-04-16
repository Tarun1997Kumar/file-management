import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getFiles } from "../services/api";
import { BreadcrubItem, FileItem } from "../types/file";
import { FileUpload } from "./FileUpload";
import { FolderCreate } from "./FolderCreate";
import { File } from "./File";
import { Fragment, useState, useRef } from "react";
import Sidebar from "./SideNavBar";

function LoadingState() {
  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="animate-pulse space-y-6">
          {/* Action buttons skeleton */}
          <div className="flex gap-4">
            <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
            <div className="h-10 w-32 bg-gray-200 rounded-md"></div>
          </div>

          {/* Breadcrumb skeleton */}
          <div className="h-8 w-96 bg-gray-200 rounded-md"></div>

          {/* Files list skeleton */}
          <div className="bg-white rounded-lg shadow-sm">
            <div className="p-4 space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="flex items-center gap-4">
                  <div className="h-5 w-5 bg-gray-200 rounded"></div>
                  <div className="h-4 w-48 bg-gray-200 rounded"></div>
                  <div className="h-4 w-16 bg-gray-200 rounded ml-auto"></div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ErrorState({ error, onRetry }: { error: Error; onRetry: () => void }) {
  return (
    <div className="flex-1 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-sm p-8 text-center">
          <svg
            className="mx-auto h-12 w-12 text-red-400"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
            />
          </svg>
          <h3 className="mt-4 text-lg font-medium text-gray-900">
            Error loading files
          </h3>
          <p className="mt-2 text-sm text-gray-500">{error.message}</p>
          <button
            onClick={onRetry}
            className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            <svg
              className="mr-2 h-4 w-4"
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
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="px-6 py-12 text-center">
      <svg
        className="mx-auto h-12 w-12 text-gray-400 animate-bounce"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M5 19a2 2 0 01-2-2V7a2 2 0 012-2h4l2 2h4a2 2 0 012 2v1M5 19h14a2 2 0 002-2v-5a2 2 0 00-2-2H9a2 2 0 00-2 2v5a2 2 0 01-2 2z"
        />
      </svg>
      <h3 className="mt-2 text-sm font-medium text-gray-900">
        No files or folders
      </h3>
      <p className="mt-1 text-sm text-gray-500">
        Get started by creating a new folder or uploading a file.
      </p>
    </div>
  );
}

export function FileDashboard() {
  const { parentId } = useParams<{ parentId?: string }>();
  const navigate = useNavigate();
  const [showFolderCreate, setShowFolderCreate] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  if (isLoading) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <LoadingState />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen">
        <Sidebar />
        <ErrorState error={error as Error} onRetry={refetch} />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Sidebar />
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
    </div>
  );
}
