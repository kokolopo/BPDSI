"use client";

import { useState, useRef } from "react";
import { Upload, X, File as FileIcon, Loader2 } from "lucide-react";

interface FileUploadProps {
  label?: string;
  accept?: string;
  maxSizeMB?: number;
  onUploadSuccess?: (url: string) => void;
  onUploadError?: (error: string) => void;
}

export function FileUpload({
  label = "Unggah Dokumen",
  accept = ".pdf,.jpg,.jpeg,.png",
  maxSizeMB = 5,
  onUploadSuccess,
  onUploadError,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragging(true);
    } else if (e.type === "dragleave") {
      setIsDragging(false);
    }
  };

  const validateFile = (file: File) => {
    const validTypes = accept.split(",").map(t => t.trim());
    const fileExtension = "." + file.name.split(".").pop()?.toLowerCase();
    
    if (!validTypes.includes(fileExtension) && accept !== "*") {
      const err = "Format file tidak didukung.";
      onUploadError?.(err);
      return false;
    }

    if (file.size > maxSizeMB * 1024 * 1024) {
      const err = `Ukuran file melebihi batas maksimal ${maxSizeMB}MB.`;
      onUploadError?.(err);
      return false;
    }

    return true;
  };

  const processFile = async (selectedFile: File) => {
    if (!validateFile(selectedFile)) return;

    setFile(selectedFile);
    setIsUploading(true);

    try {
      // Simulate API call for file upload
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate a random fail condition
      if (Math.random() < 0.1) {
        throw new Error("Gagal mengunggah file. Silakan coba lagi.");
      }

      const fakeUrl = `/dummies/uploads/${selectedFile.name.replace(/\s+/g, "_")}`;
      onUploadSuccess?.(fakeUrl);
    } catch (error: any) {
      onUploadError?.(error.message);
      setFile(null);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      await processFile(e.target.files[0]);
    }
  };

  const removeFile = () => {
    setFile(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="w-full">
      {label && <p className="mb-2 text-sm font-medium text-zinc-700 dark:text-zinc-300">{label}</p>}
      
      {!file ? (
        <div
          className={`relative flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 transition-colors ${
            isDragging
              ? "border-blue-500 bg-blue-50 dark:border-blue-500 dark:bg-blue-900/20"
              : "border-zinc-300 bg-zinc-50 hover:border-zinc-400 dark:border-zinc-700 dark:bg-zinc-800/50 dark:hover:border-zinc-600"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <input
            ref={inputRef}
            type="file"
            className="hidden"
            accept={accept}
            onChange={handleChange}
          />
          <div className="flex flex-col items-center justify-center text-center">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-zinc-100 dark:bg-zinc-800">
              <Upload className="h-6 w-6 text-zinc-500 dark:text-zinc-400" />
            </div>
            <p className="mb-1 text-sm font-semibold text-zinc-700 dark:text-zinc-300">
              Klik untuk unggah atau seret file ke sini
            </p>
            <p className="text-xs text-zinc-500">
              SVG, PNG, JPG or PDF (Max. {maxSizeMB}MB)
            </p>
          </div>
        </div>
      ) : (
        <div className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm dark:border-zinc-800 dark:bg-zinc-900">
          <div className="flex items-center gap-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <FileIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-900 dark:text-white line-clamp-1">
                {file.name}
              </p>
              <p className="text-xs text-zinc-500">
                {(file.size / (1024 * 1024)).toFixed(2)} MB
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            {isUploading && (
              <div className="flex items-center gap-2 text-xs font-medium text-blue-600 dark:text-blue-400">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Mengunggah...</span>
              </div>
            )}
            {!isUploading && (
              <button
                onClick={removeFile}
                className="rounded-lg p-2 text-zinc-400 hover:bg-zinc-100 hover:text-zinc-600 dark:hover:bg-zinc-800 dark:hover:text-zinc-300"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
