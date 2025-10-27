// src/components/certificate/image-controls.tsx
"use client";

import { useRef } from "react";
import { Button } from "@/components/ui/button";

interface ImageControlsProps {
  onAddImage: (src: string) => void;
  disabled?: boolean;
}

export default function ImageControls({
  onAddImage,
  disabled,
}: ImageControlsProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imageUrl = event.target?.result as string;
        onAddImage(imageUrl);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="space-y-2">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileUpload}
        className="hidden"
      />

      <Button
        onClick={() => fileInputRef.current?.click()}
        className="w-full"
        variant="outline"
        disabled={disabled}
      >
        + Add Signature/Image
      </Button>

      <p className="text-xs text-gray-500 text-center">
        Upload PNG with transparent background for best results
      </p>
    </div>
  );
}
