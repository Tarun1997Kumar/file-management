// src/components/FolderCreate.tsx
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createFolder } from "../services/api";
import { FormEvent } from "react";

interface FolderCreateProps {
  parentId?: string;
}

export function FolderCreate({ parentId }: FolderCreateProps) {
  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: (folderName: string) =>
      createFolder({ folderName: folderName, parentId }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files", parentId] });
    },
    onError: (error) => {
      console.error("Error creating folder:", error);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const folderName = formData.get("folderName") as string;
    mutation.mutate(folderName);
  };

  return (
    <form onSubmit={handleSubmit} className="flex items-center">
      <input
        type="text"
        name="folderName"
        placeholder="Folder name"
        className="border p-2 mr-2 rounded w-full md:w-64"
        disabled={mutation.isPending}
      />
      <button
        type="submit"
        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:bg-gray-400 flex items-center space-x-2"
        disabled={mutation.isPending}
      >
        {mutation.isPending ? (
          "Creating..."
        ) : (
          <>
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M12 6v6m0 0v6m0-6h6m-6 0H6"
              ></path>
            </svg>
            <span>Folder</span>
          </>
        )}
      </button>
      {/* display a toast */}
      {mutation.isError && (
        <p className="text-red-500 mt-2">
          Error creating folder: {(mutation.error as Error).message}
        </p>
      )}
      {mutation.isSuccess && (
        <p className="text-green-500 mt-2">Folder created successfully</p>
      )}
    </form>
  );
}
