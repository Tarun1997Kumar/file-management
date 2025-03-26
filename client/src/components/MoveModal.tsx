import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { fetchFolders } from "../services/api";
import { FileItem } from "../types/file";

interface MoveModalProps {
  item: FileItem;
  onMove: (newParentId: string | null) => void;
  onClose: () => void;
}

export function MoveModal({ item, onMove, onClose }: MoveModalProps) {
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const { data, isLoading, error } = useQuery({
    queryKey: ["folders"],
    queryFn: () => fetchFolders(), // Fetch only folders
  });

  useEffect(() => {
    if (data && !selectedFolder) {
      setSelectedFolder(null);
    }
  }, [data, selectedFolder]);

  if (isLoading) return <p>Loading folders...</p>;
  if (error) return <p>Error loading folders</p>;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white p-5 rounded-lg shadow-lg w-96">
        <h2 className="text-lg font-bold mb-4">Move "{item.name}"</h2>
        <ul className="max-h-60 overflow-y-auto">
          {data?.map((folder: FileItem) => (
            <li
              key={folder._id}
              className={`p-2 rounded cursor-pointer ${
                selectedFolder === folder._id
                  ? "bg-blue-300"
                  : "hover:bg-gray-200"
              }`}
              onClick={() => setSelectedFolder(folder._id)}
            >
              📁 {folder.name}
            </li>
          ))}
        </ul>
        <div className="mt-4 flex justify-between">
          <button className="px-4 py-2 bg-gray-300 rounded" onClick={onClose}>
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => {
              onMove(selectedFolder);
              onClose();
            }}
            disabled={!selectedFolder}
          >
            Move Here
          </button>
        </div>
      </div>
    </div>
  );
}
