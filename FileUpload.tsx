import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Camera,
  Image,
  Video,
  Music,
  FileText,
  MapPin,
  X,
  Trash2,
  Eye,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface FileUploadProps {
  onFileUpload: (files: FileList) => void;
  onClose: () => void;
  maxFiles?: number;
  acceptedTypes?: string[];
}

interface UploadedFile {
  file: File;
  preview: string;
  type: "image" | "video" | "audio" | "document" | "other";
}

const quickActions = [
  {
    id: "camera",
    label: "Camera",
    icon: Camera,
    color: "bg-blue-500",
    accept: "image/*",
    capture: "environment",
  },
  {
    id: "photos",
    label: "Photos",
    icon: Image,
    color: "bg-green-500",
    accept: "image/*",
  },
  {
    id: "videos",
    label: "Videos",
    icon: Video,
    color: "bg-purple-500",
    accept: "video/*",
  },
  {
    id: "audio",
    label: "Audio",
    icon: Music,
    color: "bg-yellow-500",
    accept: "audio/*",
  },
  {
    id: "documents",
    label: "Documents",
    icon: FileText,
    color: "bg-red-500",
    accept: ".pdf,.doc,.docx,.txt,.rtf",
  },
  { id: "location", label: "Location", icon: MapPin, color: "bg-orange-500" },
];

export default function FileUpload({
  onFileUpload,
  onClose,
  maxFiles = 10,
  acceptedTypes = ["*/*"],
}: FileUploadProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getFileType = (file: File): UploadedFile["type"] => {
    if (file.type.startsWith("image/")) return "image";
    if (file.type.startsWith("video/")) return "video";
    if (file.type.startsWith("audio/")) return "audio";
    if (
      file.type.includes("pdf") ||
      file.type.includes("document") ||
      file.type.includes("text")
    )
      return "document";
    return "other";
  };

  const createFilePreview = useCallback((file: File): Promise<string> => {
    return new Promise((resolve) => {
      if (file.type.startsWith("image/")) {
        const reader = new FileReader();
        reader.onload = (e) => resolve(e.target?.result as string);
        reader.readAsDataURL(file);
      } else {
        resolve(""); // No preview for non-image files
      }
    });
  }, []);

  const handleFiles = useCallback(
    async (files: FileList) => {
      if (uploadedFiles.length + files.length > maxFiles) {
        alert(`Maximum ${maxFiles} files allowed`);
        return;
      }

      setIsUploading(true);
      const newFiles: UploadedFile[] = [];

      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        const preview = await createFilePreview(file);
        const type = getFileType(file);

        newFiles.push({ file, preview, type });
      }

      setUploadedFiles((prev) => [...prev, ...newFiles]);
      setIsUploading(false);
    },
    [uploadedFiles.length, maxFiles, createFilePreview],
  );

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setIsDragOver(false);

      const files = e.dataTransfer.files;
      if (files.length > 0) {
        handleFiles(files);
      }
    },
    [handleFiles],
  );

  const handleFileSelect = useCallback((accept?: string, capture?: string) => {
    if (fileInputRef.current) {
      fileInputRef.current.accept = accept || "*/*";
      if (capture) {
        fileInputRef.current.capture = capture as any;
      } else {
        fileInputRef.current.removeAttribute("capture");
      }
      fileInputRef.current.click();
    }
  }, []);

  const removeFile = useCallback((index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const sendFiles = useCallback(() => {
    if (uploadedFiles.length === 0) return;

    const fileList = new DataTransfer();
    uploadedFiles.forEach(({ file }) => fileList.items.add(file));

    onFileUpload(fileList.files);
    setUploadedFiles([]);
    onClose();
  }, [uploadedFiles, onFileUpload, onClose]);

  const getFileIcon = (type: UploadedFile["type"]) => {
    switch (type) {
      case "image":
        return Image;
      case "video":
        return Video;
      case "audio":
        return Music;
      case "document":
        return FileText;
      default:
        return FileText;
    }
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      className="bg-gray-800 border border-gray-600 rounded-xl p-4 shadow-2xl"
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-white font-semibold">Share Files</h3>
        <Button
          size="sm"
          variant="ghost"
          onClick={onClose}
          className="text-gray-400 hover:text-white p-1"
        >
          <X size={16} />
        </Button>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        {quickActions.map((action) => {
          const IconComponent = action.icon;
          return (
            <button
              key={action.id}
              onClick={() => {
                if (action.id === "location") {
                  // Handle location sharing
                  navigator.geolocation?.getCurrentPosition((position) => {
                    const location = `📍 Location: ${position.coords.latitude}, ${position.coords.longitude}`;
                    console.log("Share location:", location);
                  });
                } else {
                  handleFileSelect(action.accept, action.capture);
                }
              }}
              className={cn(
                "flex flex-col items-center gap-2 p-3 rounded-lg text-white transition-all hover:scale-105",
                action.color,
                "hover:shadow-lg",
              )}
            >
              <IconComponent size={24} />
              <span className="text-xs font-medium">{action.label}</span>
            </button>
          );
        })}
      </div>

      {/* Drag & Drop Area */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={cn(
          "border-2 border-dashed border-gray-600 rounded-lg p-6 text-center transition-colors",
          isDragOver && "border-blue-500 bg-blue-500/10",
        )}
      >
        <Upload className="mx-auto mb-2 text-gray-400" size={32} />
        <p className="text-gray-300 mb-2">
          Drag & drop files here, or{" "}
          <button
            onClick={() => handleFileSelect()}
            className="text-blue-400 hover:text-blue-300 underline"
          >
            browse
          </button>
        </p>
        <p className="text-sm text-gray-500">
          Maximum {maxFiles} files • Up to 100MB each
        </p>
      </div>

      {/* Uploaded Files Preview */}
      <AnimatePresence>
        {uploadedFiles.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="mt-4"
          >
            <h4 className="text-white font-medium mb-3">
              Selected Files ({uploadedFiles.length})
            </h4>
            <div className="space-y-2 max-h-40 overflow-y-auto custom-scrollbar">
              {uploadedFiles.map((uploadedFile, index) => {
                const FileIcon = getFileIcon(uploadedFile.type);
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    className="flex items-center gap-3 p-2 bg-gray-700 rounded-lg"
                  >
                    {uploadedFile.preview ? (
                      <img
                        src={uploadedFile.preview}
                        alt="Preview"
                        className="w-10 h-10 object-cover rounded"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-gray-600 rounded flex items-center justify-center">
                        <FileIcon size={16} className="text-gray-300" />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <p className="text-white text-sm truncate">
                        {uploadedFile.file.name}
                      </p>
                      <p className="text-gray-400 text-xs">
                        {formatFileSize(uploadedFile.file.size)}
                      </p>
                    </div>

                    <div className="flex items-center gap-1">
                      {uploadedFile.preview && (
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() =>
                            window.open(uploadedFile.preview, "_blank")
                          }
                          className="text-gray-400 hover:text-white p-1"
                        >
                          <Eye size={14} />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => removeFile(index)}
                        className="text-red-400 hover:text-red-300 p-1"
                      >
                        <Trash2 size={14} />
                      </Button>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Actions */}
      {uploadedFiles.length > 0 && (
        <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-600">
          <span className="text-sm text-gray-400">
            {uploadedFiles.length} file{uploadedFiles.length !== 1 ? "s" : ""}{" "}
            ready to send
          </span>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="outline"
              onClick={() => setUploadedFiles([])}
              className="text-gray-400 hover:text-white"
            >
              Clear All
            </Button>
            <Button
              size="sm"
              onClick={sendFiles}
              disabled={isUploading}
              className="bg-blue-500 hover:bg-blue-600 text-white"
            >
              {isUploading ? "Processing..." : "Send Files"}
            </Button>
          </div>
        </div>
      )}

      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        multiple
        className="hidden"
        onChange={(e) => e.target.files && handleFiles(e.target.files)}
      />
    </motion.div>
  );
}
