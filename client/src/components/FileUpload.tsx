import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFile } from "../services/api";
import { useRef } from "react";
import { AxiosError } from "axios";

interface FileUploadProps {
  parentId?: string;
}

export function FileUpload({ parentId }: FileUploadProps) {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const uploadMutation = useMutation({
    mutationFn: (formData: FormData) => uploadFile(formData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["files", parentId],
      });
    },
    onError: (error: AxiosError) => {
      console.error("error: ", error.response?.data);
    },
  });

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      if (parentId) formData.append("parentId", parentId);
      uploadMutation.mutate(formData);
      event.target.value = "";
    }
  };

  return (
    <div className="flex items-center">
      <input
        type="file"
        name="file"
        id="file-upload"
        ref={fileInputRef}
        onChange={handleFileChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={handleUploadClick}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 flex items-center space-x-2 cursor-pointer"
        disabled={uploadMutation.isPending}
      >
        {uploadMutation.isPending ? (
          "Uploading..."
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
            <span>Upload</span>
          </>
        )}
      </button>
    </div>
  );
}
