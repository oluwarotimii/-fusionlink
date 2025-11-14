import { useState, useRef, ChangeEvent } from 'react';
import { Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ImageUploadProps {
  onImageChange: (file: File | null) => void;
  currentImageUrl?: string;
  label?: string;
}

const ImageUpload = ({ onImageChange, currentImageUrl, label = "Course Image" }: ImageUploadProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentImageUrl || null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.match('image.*')) {
        alert('Please select an image file');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('File size exceeds 5MB limit');
        return;
      }

      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      onImageChange(file);
    }
  };

  const handleRemoveImage = () => {
    setPreviewUrl(null);
    setSelectedFile(null);
    onImageChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleButtonClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-medium text-slate-700 mb-2">{label}</label>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
      />
      
      <div className="space-y-3">
        {previewUrl ? (
          <div className="relative group">
            <img 
              src={previewUrl} 
              alt="Preview" 
              className="w-full h-48 object-contain rounded-lg border border-slate-200 max-w-md"
            />
            <button
              type="button"
              onClick={handleRemoveImage}
              className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              aria-label="Remove image"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        ) : (
          <div 
            onClick={handleButtonClick}
            className="border-2 border-dashed border-slate-300 rounded-lg p-8 text-center cursor-pointer hover:border-yellow-400 transition-colors bg-slate-50 flex flex-col items-center justify-center"
          >
            <Upload className="w-10 h-10 text-slate-400 mb-3" />
            <p className="text-slate-600">Click to upload image</p>
            <p className="text-sm text-slate-500 mt-1">(Max 5MB, JPG, PNG, GIF)</p>
          </div>
        )}
        
        {!previewUrl && (
          <Button
            type="button"
            onClick={handleButtonClick}
            variant="outline"
            className="w-full"
          >
            <Upload className="w-4 h-4 mr-2" />
            Select Image
          </Button>
        )}
      </div>
    </div>
  );
};

export default ImageUpload;