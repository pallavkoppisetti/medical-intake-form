import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Save, RotateCcw, Upload } from 'lucide-react';

export interface SignatureComponentProps {
  onSignatureChange: (signatureDataUrl: string) => void;
  existingSignature?: string;
  width?: number;
  height?: number;
  className?: string;
  required?: boolean;
  label?: string;
}

export const SignatureComponent: React.FC<SignatureComponentProps> = ({
  onSignatureChange,
  existingSignature,
  width = 400,
  height = 150,
  className = '',
  required = false,
  label = 'Digital Signature',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasSignature, setHasSignature] = useState(false);
  const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

  // Initialize canvas and load existing signature
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = width;
    canvas.height = height;

    // Set drawing properties
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 2;

    // Always set white background for better visibility and PDF generation
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Load existing signature if provided
    if (existingSignature) {
      const img = new Image();
      img.onload = () => {
        // Only clear if we don't already have a signature being drawn
        if (!hasSignature || !isDrawing) {
          ctx.fillStyle = '#ffffff';
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
          setHasSignature(true);
        }
      };
      img.src = existingSignature;
    }
  }, [width, height]); // Removed existingSignature from dependencies to prevent redrawing during auto-save

  // Separate effect for loading existing signature only when it changes externally
  useEffect(() => {
    if (existingSignature && !hasSignature && !isDrawing) {
      const canvas = canvasRef.current;
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      const img = new Image();
      img.onload = () => {
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        setHasSignature(true);
      };
      img.src = existingSignature;
    }
  }, [existingSignature, hasSignature, isDrawing]);

  // Get coordinates relative to canvas
  const getCoordinates = useCallback((event: MouseEvent | TouchEvent, canvas: HTMLCanvasElement) => {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const clientX = 'touches' in event ? event.touches[0].clientX : event.clientX;
    const clientY = 'touches' in event ? event.touches[0].clientY : event.clientY;
    
    return {
      x: (clientX - rect.left) * scaleX,
      y: (clientY - rect.top) * scaleY,
    };
  }, []);

  // Start drawing
  const startDrawing = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    setIsDrawing(true);
    
    const coords = 'touches' in event 
      ? getCoordinates(event.nativeEvent as TouchEvent, canvas)
      : getCoordinates(event.nativeEvent as MouseEvent, canvas);
    
    setLastPosition(coords);
    
    // Prevent scrolling on touch devices
    event.preventDefault();
  }, [getCoordinates]);

  // Draw line
  const draw = useCallback((event: React.MouseEvent | React.TouchEvent) => {
    if (!isDrawing) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const coords = 'touches' in event 
      ? getCoordinates(event.nativeEvent as TouchEvent, canvas)
      : getCoordinates(event.nativeEvent as MouseEvent, canvas);

    ctx.beginPath();
    ctx.moveTo(lastPosition.x, lastPosition.y);
    ctx.lineTo(coords.x, coords.y);
    ctx.stroke();

    setLastPosition(coords);
    setHasSignature(true);
    
    // Prevent scrolling on touch devices
    event.preventDefault();
  }, [isDrawing, lastPosition, getCoordinates]);

  // Stop drawing
  const stopDrawing = useCallback(() => {
    setIsDrawing(false);
  }, []);

  // Clear signature
  const clearSignature = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasSignature(false);
    onSignatureChange('');
  }, [onSignatureChange]);

  // Save signature
  const saveSignature = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || !hasSignature) return;

    const dataUrl = canvas.toDataURL('image/png');
    onSignatureChange(dataUrl);
  }, [hasSignature, onSignatureChange]);

  // Handle file upload for signature
  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file.');
      return;
    }

    // Validate file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.');
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Clear canvas and set white background
        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Calculate dimensions to fit image while maintaining aspect ratio
        const maxWidth = canvas.width;
        const maxHeight = canvas.height;
        let { width: imgWidth, height: imgHeight } = img;

        // Scale down if necessary
        if (imgWidth > maxWidth || imgHeight > maxHeight) {
          const ratio = Math.min(maxWidth / imgWidth, maxHeight / imgHeight);
          imgWidth *= ratio;
          imgHeight *= ratio;
        }

        // Center the image
        const x = (canvas.width - imgWidth) / 2;
        const y = (canvas.height - imgHeight) / 2;

        // Draw the image
        ctx.drawImage(img, x, y, imgWidth, imgHeight);

        // Update state and trigger save
        setHasSignature(true);
        const dataUrl = canvas.toDataURL('image/png');
        onSignatureChange(dataUrl);
      };
      img.src = e.target?.result as string;
    };
    reader.readAsDataURL(file);

    // Clear the file input
    event.target.value = '';
  }, [onSignatureChange]);

  // Trigger file input
  const triggerFileUpload = useCallback(() => {
    fileInputRef.current?.click();
  }, []);

  // Auto-save signature on drawing with debounce
  useEffect(() => {
    if (hasSignature && !isDrawing) {
      const canvas = canvasRef.current;
      if (canvas) {
        // Add a small delay to ensure drawing is complete
        const timer = setTimeout(() => {
          const dataUrl = canvas.toDataURL('image/png');
          console.log('Signature captured:', dataUrl.length > 100 ? 'Success' : 'Failed');
          onSignatureChange(dataUrl);
        }, 100); // 100ms delay to ensure drawing is complete

        return () => clearTimeout(timer);
      }
    }
  }, [hasSignature, isDrawing]); // Removed onSignatureChange from dependencies to prevent loops

  return (
    <div className={`signature-component ${className}`}>
      {/* Label */}
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>

      {/* Canvas Container */}
      <div className="signature-canvas-container border-2 border-gray-300 rounded-lg p-4 bg-white">
        <canvas
          ref={canvasRef}
          className="border border-gray-200 rounded cursor-crosshair touch-none"
          style={{ 
            width: '100%', 
            maxWidth: `${width}px`,
            height: 'auto',
            aspectRatio: `${width} / ${height}`
          }}
          onMouseDown={startDrawing}
          onMouseMove={draw}
          onMouseUp={stopDrawing}
          onMouseLeave={stopDrawing}
          onTouchStart={startDrawing}
          onTouchMove={draw}
          onTouchEnd={stopDrawing}
        />
        
        {/* Instructions */}
        <p className="text-xs text-gray-500 mt-2 text-center">
          {hasSignature ? 'Signature captured' : 'Sign above using your mouse or finger, or upload an image'}
        </p>
      </div>

      {/* Upload Options */}
      <div className="flex items-center justify-center mt-2 mb-2">
        <span className="text-xs text-gray-400">OR</span>
      </div>
      
      <div className="flex justify-center mb-3">
        <button
          type="button"
          onClick={triggerFileUpload}
          className="flex items-center px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
        >
          <Upload className="w-4 h-4 mr-2" />
          Upload Signature Image
        </button>
        
        {/* Hidden file input */}
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
        />
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-between mt-3 space-x-2">
        <button
          type="button"
          onClick={clearSignature}
          className="flex items-center px-3 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors"
          disabled={!hasSignature}
        >
          <RotateCcw className="w-4 h-4 mr-1" />
          Clear
        </button>

        <div className="flex items-center space-x-2">
          {hasSignature && (
            <span className="text-xs text-green-600 flex items-center">
              <Save className="w-3 h-3 mr-1" />
              Auto-saved
            </span>
          )}
          
          <button
            type="button"
            onClick={saveSignature}
            className="flex items-center px-3 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            disabled={!hasSignature}
          >
            <Save className="w-4 h-4 mr-1" />
            Save Signature
          </button>
        </div>
      </div>

      {/* Required field validation message */}
      {required && !hasSignature && (
        <p className="text-sm text-red-600 mt-1">
          Digital signature is required to complete the form.
        </p>
      )}
    </div>
  );
};

export default SignatureComponent;
