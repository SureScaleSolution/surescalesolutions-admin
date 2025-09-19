import Image from "next/image";
import React, { useRef } from "react";
import { ImagePreview } from "@/hooks/useCaseStudyForm";

interface ImageUploadProps {
  preview?: ImagePreview;
  onImageChange: (file: File | null) => void;
  label?: string;
  className?: string;
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  preview,
  onImageChange,
  label = "Upload Image in webp, jpg, png less than 5MB",
  className = "",
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    onImageChange(file);
  };

  const handleRemoveImage = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    onImageChange(null);
  };

  return (
    <div className={`relative w-full max-w-[800px] ${className}`}>
      {preview ? (
        <>
          <div className="relative">
            <div className="w-full h-32 md:h-48 border border-primary rounded-lg overflow-hidden">
              <Image
                src={preview.url}
                alt="Preview"
                className="w-full h-full object-cover"
                width={800}
                height={200}
              />
            </div>
            <div className="flex mt-2 justify-center">
              <button
                type="button"
                onClick={handleRemoveImage}
                className="cursor-pointer px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors text-sm">
                Remove Image
              </button>
            </div>
          </div>
        </>
      ) : (
        <>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/webp,image/jpeg,image/jpg,image/png"
            onChange={handleFileChange}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
          />
          <div className="w-full h-32 md:h-48 border-1 border-primary rounded-lg flex items-center justify-center transition-colors duration-300 hover:bg-gray-50">
            <div className="w-[44px] md:w-[77px]">
              <Image
                src="/case-studies/uploadIcon.svg"
                alt="Upload Image"
                className="w-full h-auto"
                width={100}
                height={100}
              />
            </div>
          </div>
          <p className="text-xs sm:text-sm text-darkGray mt-2 text-center">
            {label}
          </p>
        </>
      )}
    </div>
  );
};
