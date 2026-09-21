import React, { useState, useRef, useEffect } from 'react';
import {
  Upload,
  X,
  Star,
  Plus,
  Image as ImageIcon,
  ArrowLeft,
  ArrowRight,
  Link as LinkIcon,
  Check,
  AlertCircle,
  Sparkles,
} from 'lucide-react';

interface ProductImageUploaderProps {
  images: string[];
  onChange: (images: string[]) => void;
}

// Compress / optimize image to safe max dimension before creating DataURL
const processImageFile = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      reject(new Error('Only image files (JPG, PNG, WebP) are allowed'));
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      if (!result) {
        reject(new Error('Failed to read image'));
        return;
      }

      // Always normalize images before storing them in Firestore/localStorage.
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        const maxDimension = 1200;

        if (width > maxDimension || height > maxDimension) {
          if (width > height) {
            height = Math.round((height * maxDimension) / width);
            width = maxDimension;
          } else {
            width = Math.round((width * maxDimension) / height);
            height = maxDimension;
          }
        }

        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(result);
          return;
        }

        ctx.imageSmoothingEnabled = true;
        ctx.imageSmoothingQuality = 'high';
        ctx.drawImage(img, 0, 0, width, height);

        const optimizedDataUrl = canvas.toDataURL('image/jpeg', 0.82);
        resolve(optimizedDataUrl);
      };
      img.onerror = () => resolve(result); // Fallback to raw dataUrl
      img.src = result;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
};

export const ProductImageUploader: React.FC<ProductImageUploaderProps> = ({
  images,
  onChange,
}) => {
  const imagesRef = useRef(images);
  const [isDragging, setIsDragging] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [showUrlInput, setShowUrlInput] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    imagesRef.current = images;
  }, [images]);

  const handleFiles = async (files: FileList | File[]) => {
    setErrorMsg(null);
    setIsProcessing(true);

    try {
      const newImagesList: string[] = [];
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        if (file.type.startsWith('image/')) {
          const dataUrl = await processImageFile(file);
          newImagesList.push(dataUrl);
        }
      }

      if (newImagesList.length > 0) {
        onChange([...imagesRef.current, ...newImagesList]);
      } else {
        setErrorMsg('Please select valid image files.');
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error uploading images');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
      // Reset input value so same file can be re-uploaded if desired
      e.target.value = '';
    }
  };

  const handleRemoveImage = (index: number) => {
    const updated = images.filter((_, i) => i !== index);
    onChange(updated);
  };

  const handleSetMainCover = (index: number) => {
    if (index === 0) return;
    const targetImage = images[index];
    const rest = images.filter((_, i) => i !== index);
    onChange([targetImage, ...rest]);
  };

  const handleMove = (index: number, direction: 'left' | 'right') => {
    const targetIdx = direction === 'left' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= images.length) return;
    const newArr = [...images];
    const temp = newArr[index];
    newArr[index] = newArr[targetIdx];
    newArr[targetIdx] = temp;
    onChange(newArr);
  };

  const handleAddUrl = (e: React.FormEvent) => {
    e.preventDefault();
    if (!urlInput.trim()) return;
    onChange([...imagesRef.current, urlInput.trim()]);
    setUrlInput('');
    setShowUrlInput(false);
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="font-semibold text-xs text-[#4A382D] dark:text-[#F0E6DC] flex items-center gap-1.5">
          <ImageIcon className="w-3.5 h-3.5 text-[#B89578]" />
          <span>Product Images *</span>
          <span className="text-[11px] font-normal text-[#82756C] dark:text-[#AD9E92]">
            ({images.length} {images.length === 1 ? 'image' : 'images'})
          </span>
        </label>

        <button
          type="button"
          onClick={() => setShowUrlInput(!showUrlInput)}
          className="text-[11px] text-[#77553b] dark:text-[#C8A882] hover:underline flex items-center gap-1 cursor-pointer font-medium"
        >
          <LinkIcon className="w-3 h-3" />
          <span>{showUrlInput ? 'Hide URL input' : 'Add via Link/URL'}</span>
        </button>
      </div>

      {/* URL Input Bar (optional toggle) */}
      {showUrlInput && (
        <form onSubmit={handleAddUrl} className="flex gap-2">
          <input
            type="url"
            value={urlInput}
            onChange={(e) => setUrlInput(e.target.value)}
            placeholder="https://example.com/photo.jpg"
            className="flex-1 text-xs p-2.5 bg-[#F5E6D3]/30 dark:bg-[#241C17] border border-[#d4c3b9] dark:border-[#3D3027] text-[#4A382D] dark:text-[#F0E6DC] rounded focus:outline-none focus:border-[#77553b]"
          />
          <button
            type="submit"
            className="px-3 py-2 bg-[#77553b] hover:bg-[#5C3F2B] text-[#FFFDF9] text-xs font-semibold rounded cursor-pointer transition-colors"
          >
            Add URL
          </button>
        </form>
      )}

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all duration-200 ${
          isDragging
            ? 'border-[#B89578] bg-[#F5E6D3]/60 dark:bg-[#2B221C] scale-[0.99]'
            : 'border-[#d4c3b9] dark:border-[#3D3027] bg-[#FAF7F2] dark:bg-[#1D1612] hover:bg-[#F5E6D3]/30 dark:hover:bg-[#241C17] hover:border-[#B89578]'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, image/jpg, image/webp, image/avif"
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center gap-2">
          <div className="w-12 h-12 rounded-full bg-[#B89578]/15 dark:bg-[#B89578]/25 text-[#77553b] dark:text-[#E6D0BA] flex items-center justify-center shadow-xs">
            {isProcessing ? (
              <div className="w-5 h-5 border-2 border-[#B89578] border-t-transparent rounded-full animate-spin" />
            ) : (
              <Upload className="w-6 h-6" />
            )}
          </div>

          <div>
            <p className="text-xs font-bold text-[#27180F] dark:text-[#FFFDF9]">
              {isProcessing
                ? 'Processing high-resolution images...'
                : 'Click to browse images or drag & drop here'}
            </p>
            <p className="text-[11px] text-[#82756C] dark:text-[#AD9E92] mt-0.5">
              Supports JPG, PNG, WebP (high-definition preserved)
            </p>
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#FFFDF9] dark:bg-[#2B221C] border border-[#d4c3b9] dark:border-[#3D3027] rounded-full text-[10px] font-semibold text-[#77553b] dark:text-[#C8A882] shadow-xs mt-1">
            <Sparkles className="w-3 h-3 text-[#B89578]" />
            <span>You can upload multiple images simultaneously</span>
          </div>
        </div>
      </div>

      {errorMsg && (
        <div className="p-2.5 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 text-xs rounded-lg flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Uploaded Images Gallery Preview */}
      {images.length > 0 ? (
        <div className="space-y-2 pt-1">
          <div className="text-[11px] font-semibold text-[#82756C] dark:text-[#AD9E92] flex items-center justify-between">
            <span>Uploaded Images (Use arrows to reorder):</span>
            <span className="text-[10px] text-[#77553b] dark:text-[#C8A882]">
              ★ First image is the main product cover
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
            {images.map((imgUrl, index) => (
              <div
                key={index}
                className={`relative group bg-[#FFFDF9] dark:bg-[#241C17] rounded-lg border overflow-hidden shadow-xs transition-all ${
                  index === 0
                    ? 'border-[#B89578] ring-2 ring-[#B89578]/30'
                    : 'border-[#d4c3b9] dark:border-[#3D3027]'
                }`}
              >
                {/* Image display */}
                <div className="aspect-[3/4] w-full overflow-hidden bg-stone-100 dark:bg-stone-900 flex items-center justify-center">
                  <img
                    src={imgUrl}
                    alt={`Product preview ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>

                {/* Primary Cover Badge */}
                {index === 0 && (
                  <div className="absolute top-1.5 left-1.5 px-2 py-0.5 bg-[#B89578] text-[#FFFDF9] text-[9px] font-bold uppercase tracking-wider rounded shadow-md flex items-center gap-1">
                    <Star className="w-2.5 h-2.5 fill-current" />
                    <span>Main Cover</span>
                  </div>
                )}

                {/* Top action: Delete */}
                <button
                  type="button"
                  onClick={() => handleRemoveImage(index)}
                  className="absolute top-1.5 right-1.5 p-1 bg-[#1E1610]/80 hover:bg-red-600 text-[#FFFDF9] rounded-full transition-colors opacity-90 group-hover:opacity-100 shadow-md cursor-pointer"
                  title="Remove image"
                >
                  <X className="w-3.5 h-3.5" />
                </button>

                {/* Bottom Overlay Controls */}
                <div className="p-1.5 bg-[#FAF7F2] dark:bg-[#1D1612] border-t border-[#d4c3b9] dark:border-[#3D3027] flex items-center justify-between gap-1">
                  {/* Reorder Buttons */}
                  <div className="flex items-center gap-0.5">
                    <button
                      type="button"
                      disabled={index === 0}
                      onClick={() => handleMove(index, 'left')}
                      className="p-1 text-[#82756C] dark:text-[#AD9E92] hover:text-[#27180F] dark:hover:text-[#FFFDF9] disabled:opacity-30 disabled:hover:text-[#82756C] rounded transition-colors cursor-pointer"
                      title="Move backward"
                    >
                      <ArrowLeft className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      disabled={index === images.length - 1}
                      onClick={() => handleMove(index, 'right')}
                      className="p-1 text-[#82756C] dark:text-[#AD9E92] hover:text-[#27180F] dark:hover:text-[#FFFDF9] disabled:opacity-30 disabled:hover:text-[#82756C] rounded transition-colors cursor-pointer"
                      title="Move forward"
                    >
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>

                  {/* Set Main Button */}
                  {index !== 0 && (
                    <button
                      type="button"
                      onClick={() => handleSetMainCover(index)}
                      className="text-[10px] text-[#77553b] dark:text-[#C8A882] hover:underline font-semibold flex items-center gap-0.5 cursor-pointer"
                      title="Make this the main display image"
                    >
                      <Star className="w-2.5 h-2.5" />
                      <span>Set Main</span>
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-3 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/50 rounded-lg text-amber-800 dark:text-amber-200 text-xs flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
          <span>Please upload at least one image so customers can view the product in the store.</span>
        </div>
      )}
    </div>
  );
};
