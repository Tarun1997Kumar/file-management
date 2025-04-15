import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "react-router-dom";
import { getFiles } from "../services/api";
import { BreadcrubItem, FileItem } from "../types/file";
import { FileUpload } from "./FileUpload";
import { FolderCreate } from "./FolderCreate";
import { File } from "./File";
import { Fragment } from "react/jsx-runtime";
import Sidebar from "./SideNavBar";

export function FileDashboard() {
  const { parentId } = useParams<{ parentId?: string }>();
  const navigate = useNavigate();

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

  const handleNavigateUp = () => {
    if (parentId && currentFolder) {
      navigate(
        currentFolder.parentId
          ? `/file-dashboard/${currentFolder.parentId}`
          : "/file-dashboard"
      );
    }
  };

  if (isLoading)
    return (
      <div className="p-4">
        <div className="flex justify-center items-center h-full">
          <span className="loading loading-spinner loading-lg"></span>
        </div>
      </div>
    );

  if (error) {
    return (
      <div className="p-4">
        <p className="p-4 max-w-4xl mx-auto">
          Error loading files: {(error as Error).message}
        </p>
        <button
          onClick={() => refetch()}
          className="mt-4 bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="flex">
      <Sidebar />
      <div className="p-3">
        <div>
          <div className="flex justify-start mb-4 gap-5">
            <FileUpload parentId={parentId} />
            <FolderCreate parentId={parentId} />
            <button
              onClick={() => refetch()}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
            >
              Refresh
            </button>
          </div>

          <div className="flex items-center">
            <button
              onClick={() => navigate("/file-dashboard")}
              className="text-blue-500 hover:underline"
            >
              root
            </button>
            {breadcrumbs.map((folder) => (
              <Fragment key={folder._id}>
                <span className="mx-1">/</span>
                <button
                  onClick={() => navigate(`/file-dashboard/${folder._id}`)}
                  className="text-blue-500 hover:underline"
                >
                  {folder.name}
                </button>
              </Fragment>
            ))}

            {currentFolder && (
              <div className="flex items-center">
                <span className="mx-1">/</span>
                <button
                  onClick={handleNavigateUp}
                  className="text-blue-500 hover:underline font-semibold"
                >
                  {currentFolder.name}
                </button>
              </div>
            )}
          </div>

          <div className="bg-gray-200 text-gray-700 p-2 grid grid-cols-[1fr_8rem_10rem] gap-4 items-center text-sm font-semibold">
            <div>Name</div>
            <div className="text-right">Size</div>
          </div>
          <div className="grid gap-1 rounded">
            {files?.length == 0 ? (
              <p className="text-gray-500 text-center p-1">
                No files or folders available.
              </p>
            ) : (
              files?.map((item) => (
                <File
                  item={item}
                  key={item._id}
                  onFolderClick={handleFolderClick}
                  onRefresh={refetch}
                  parentId={parentId!}
                />
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
