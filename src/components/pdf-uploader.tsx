"use client";

import {
  useCallback,
  useState,
  useRef,
  type ChangeEvent,
  type DragEvent,
} from "react";
import { UploadCloud } from "lucide-react";
import { cn } from "@/lib/utils";

type PdfUploaderProps = {
  onFilesSelected: (files: File[]) => void;
};

export function PdfUploader({ onFilesSelected }: PdfUploaderProps) {
  const [isDragActive, setIsDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setIsDragActive(true);
    } else if (e.type === "dragleave") {
      setIsDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      onFilesSelected(Array.from(e.dataTransfer.files));
      e.dataTransfer.clearData();
    }
  };

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files.length > 0) {
      onFilesSelected(Array.from(e.target.files));
      // Reset input value to allow re-uploading the same file
      e.target.value = "";
    }
  };

  const handleClick = () => {
    inputRef.current?.click();
  };

  return (
    <div className="w-full">
      <div
        onClick={handleClick}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          "group relative flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed border-input bg-card p-12 text-center shadow-lg transition-colors duration-200 ease-in-out hover:border-primary",
          isDragActive ? "border-primary bg-accent" : ""
        )}
      >
        <input
          ref={inputRef}
          type="file"
          multiple
          accept="application/pdf"
          className="hidden"
          onChange={handleChange}
        />
        <div className="flex flex-col items-center justify-center gap-4">
          <UploadCloud className="h-12 w-12 text-muted-foreground transition-colors group-hover:text-primary" />
          <p className="text-lg font-semibold text-foreground">
            {isDragActive
              ? "Drop the files here..."
              : "Drag & drop PDF files here, or click to select"}
          </p>
          <p className="text-sm text-muted-foreground">
            Only PDF files are accepted
          </p>
        </div>
      </div>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        📄 Max 10 files, 25MB each.
      </p>
    </div>
  );
}
