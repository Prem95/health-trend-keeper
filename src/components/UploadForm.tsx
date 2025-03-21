import { useState, useRef } from "react";
import { toast } from "sonner";
import { ButtonCustom } from "@/components/ui/button-custom";

// Maximum file size: 20MB in bytes
const MAX_FILE_SIZE = 20 * 1024 * 1024;
const ACCEPTED_FILE_TYPES = ["application/pdf", "image/jpeg", "image/jpg", "image/png"];

interface UploadFormProps {
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
  progress: number;
}

const UploadForm = ({ onUpload, isUploading, progress }: UploadFormProps) => {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validate file before upload
  const validateFile = (file: File): boolean => {
    // Check file size
    if (file.size > MAX_FILE_SIZE) {
      toast.error(`File size exceeds the 20MB limit (${(file.size / (1024 * 1024)).toFixed(2)}MB)`);
      return false;
    }
    
    // Check file type
    if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
      toast.error("Only PDF, JPEG, and PNG files are accepted");
      return false;
    }
    
    return true;
  };

  // Handle file selection via button click
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      } else {
        e.target.value = ""; // Clear the input
      }
    }
  };

  // Handle file drop
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (validateFile(file)) {
        setSelectedFile(file);
      }
    }
  };

  // Handle button click to trigger file input
  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error("Please select a file to upload");
      return;
    }
    
    try {
      await onUpload(selectedFile);
      setSelectedFile(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      // Error is handled in the parent component
    }
  };

  return (
    <div className="w-full">
      <div
        className={`border-2 border-dashed rounded-lg p-8 transition-colors ${
          dragActive 
            ? "border-indigo-500 bg-indigo-50" 
            : selectedFile 
              ? "border-green-500 bg-green-50" 
              : "border-gray-300 hover:border-indigo-400"
        }`}
        onDragOver={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          e.stopPropagation();
          setDragActive(false);
        }}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center gap-4 text-center">
          <div className="text-5xl text-indigo-400">
            {selectedFile ? "📄" : "📁"}
          </div>
          
          <div>
            {selectedFile ? (
              <p className="text-lg font-medium text-green-600">
                {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)}MB)
              </p>
            ) : (
              <div className="space-y-2">
                <p className="text-lg font-medium text-gray-700">
                  Drag & drop your medical report or click to browse
                </p>
                <p className="text-sm text-gray-500">
                  Supported formats: PDF, JPEG, PNG (Max 20MB)
                </p>
              </div>
            )}
          </div>
          
          <input
            ref={fileInputRef}
            type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleFileSelect}
            className="hidden"
          />
          
          {!selectedFile && (
            <ButtonCustom
              type="button"
              variant="gradient"
              onClick={handleButtonClick}
              disabled={isUploading}
            >
              Browse Files
            </ButtonCustom>
          )}
          
          {selectedFile && !isUploading && (
            <div className="flex gap-4">
              <ButtonCustom
                type="button"
                variant="outline"
                onClick={() => setSelectedFile(null)}
              >
                Change File
              </ButtonCustom>
              
              <ButtonCustom
                type="button"
                variant="gradient"
                onClick={handleSubmit}
              >
                Upload Report
              </ButtonCustom>
            </div>
          )}
          
          {isUploading && (
            <div className="w-full max-w-xs">
              <div className="mb-2 flex justify-between text-sm">
                <span>Uploading...</span>
                <span>{progress.toFixed(0)}%</span>
              </div>
              <div className="h-2 w-full bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UploadForm; 