import { useRef, useState, DragEvent } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { uploadFile } from "../../services/fileApi";
import { LoadingSpinner } from "../helper/LoadingSpinner";
import { toast } from "react-toastify";
import { AxiosError } from "axios";
import { ErrorResponse } from "../../types/error";

interface FileUploadProps {
  parentId?: string;
}

export function FileUpload({ parentId }: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const queryClient = useQueryClient();

  const uploadMutation = useMutation({
    mutationFn: (file: File) => {
      const formData = new FormData();
      formData.append("file", file);
      if (parentId) {
        formData.append("parentId", parentId);
      }

      return uploadFile(formData, (progress) => {
        setUploadProgress(Math.round(progress));
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      toast.success("File uploaded successfully!");
      setUploadProgress(0);
    },
    onError: (error: AxiosError<ErrorResponse>) => {
      toast.error(
        `Failed to upload file: ${
          error.response?.data?.message || "Unknown error"
        }`
      );
      setUploadProgress(0);
    },
  });

  const handleDragOver = (e: DragEvent) => {
    e.preventDefault();
    setUploadProgress(0);
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent) => {
    e.preventDefault();
    setUploadProgress(0);
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      setUploadProgress(0);
      uploadMutation.mutate(files[0]);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      setUploadProgress(0);
      uploadMutation.mutate(files[0]);
    }
  };

  return (
    <div className="relative">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileSelect}
        className="hidden"
      />

      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`relative ${
          isDragging ? "ring-2 ring-blue-500 ring-offset-2" : ""
        }`}
      >
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploadMutation.isPending}
          className={`inline-flex items-center px-4 py-2 text-sm font-medium rounded-md ${
            uploadMutation.isPending
              ? "bg-gray-100 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          } transition-all duration-200`}
        >
          {uploadMutation.isPending ? (
            <div className="flex items-center">
              <LoadingSpinner size="sm" color="gray" />
              <span className="ml-2">Uploading... {uploadProgress}%</span>
            </div>
          ) : (
            <>
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
                  d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
                />
              </svg>
              Upload File
            </>
          )}
        </button>

        {isDragging && (
          <div className="absolute inset-0 bg-blue-50 bg-opacity-50 border-2 border-blue-500 border-dashed rounded-md pointer-events-none">
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-blue-600 font-medium">Drop file here</span>
            </div>
          </div>
        )}
      </div>

      {uploadMutation.isPending && (
        <div className="absolute left-0 bottom-0 w-full h-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className="h-full bg-blue-600 transition-all duration-200"
            style={{ width: `${uploadProgress}%` }}
          />
        </div>
      )}
    </div>
  );
}
