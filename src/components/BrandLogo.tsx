import React, { useEffect, useState } from 'react';

/**
 * BrandLogo
 * Loads the PNG logo and trims excess padding so the visual mark is larger in a
 * compact header WITHOUT needing the source asset re-exported. It first tries
 * to trim fully transparent pixels. If the asset has an opaque/light background
 * (common when exported on a white/off-white rectangle) it detects the corner
 * background color and trims contiguous rows/columns whose pixels stay within a
 * small delta of that background color. Falls back gracefully if anything fails.
 */
export interface BrandLogoProps {
  className?: string;
  height?: number; // render height
  src?: string;
  alt?: string;
}

const BrandLogo: React.FC<BrandLogoProps> = ({
  className = '',
  height = 56,
  src = '/logo-1-Bj2eEGTJ.png',
  alt = 'EzMedTech Logo'
}) => {
  const [croppedSrc, setCroppedSrc] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = img.naturalWidth;
        canvas.height = img.naturalHeight;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;
        ctx.drawImage(img, 0, 0);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const { data, width, height } = imageData;
        
        // --- Phase 1: transparent trim ---
        let top = height, left = width, right = 0, bottom = 0;
        for (let y = 0; y < height; y++) {
          for (let x = 0; x < width; x++) {
            const idx = (y * width + x) * 4;
            const alpha = data[idx + 3];
            if (alpha > 5) { // non-transparent pixel
              if (x < left) left = x;
              if (x > right) right = x;
              if (y < top) top = y;
              if (y > bottom) bottom = y;
            }
          }
        }

        const transparentTrimSucceeded = right > left && bottom > top;

        // --- Phase 2: background color trim if transparent trim ineffective ---
        if (!transparentTrimSucceeded) {
          // Sample corners to guess background color (average of 4 corners)
          const sample = (x: number, y: number) => {
            const i = (y * width + x) * 4; return [data[i], data[i+1], data[i+2], data[i+3]] as const; };
          const corners = [
            sample(0,0),
            sample(width-1,0),
            sample(0,height-1),
            sample(width-1,height-1)
          ];
          const bg = corners.reduce((acc, c) => [acc[0]+c[0], acc[1]+c[1], acc[2]+c[2], acc[3]+c[3]], [0,0,0,0]).map(v=>v/4) as number[];
          const delta = (p: readonly number[]) => Math.abs(p[0]-bg[0]) + Math.abs(p[1]-bg[1]) + Math.abs(p[2]-bg[2]);
          const tolerance = 42; // sum of channel diffs threshold

          // Helper to check if an entire row/column is background-like
          const rowIsBg = (y: number) => {
            for (let x=0;x<width;x++) { const i=(y*width+x)*4; if (delta([data[i],data[i+1],data[i+2],data[i+3]])>tolerance) return false; }
            return true;
          };
          const colIsBg = (x: number) => {
            for (let y=0;y<height;y++) { const i=(y*width+x)*4; if (delta([data[i],data[i+1],data[i+2],data[i+3]])>tolerance) return false; }
            return true;
          };

            // Expand inward until non-bg encountered
          let top2 = 0; while (top2 < height && rowIsBg(top2)) top2++;
          let bottom2 = height-1; while (bottom2 >= 0 && rowIsBg(bottom2)) bottom2--;
          let left2 = 0; while (left2 < width && colIsBg(left2)) left2++;
          let right2 = width-1; while (right2 >= 0 && colIsBg(right2)) right2--;

          if (right2 > left2 && bottom2 > top2) {
            left = left2; right = right2; top = top2; bottom = bottom2;
          } else {
            // Nothing meaningful trimmed; fallback entire image
            left = 0; top = 0; right = width-1; bottom = height-1;
          }
        }

        const cropWidth = Math.max(1, right - left + 1);
        const cropHeight = Math.max(1, bottom - top + 1);
        const cropCanvas = document.createElement('canvas');
        cropCanvas.width = cropWidth;
        cropCanvas.height = cropHeight;
        const cropCtx = cropCanvas.getContext('2d');
        if (!cropCtx) return;
        cropCtx.drawImage(
          canvas,
          left,
          top,
          cropWidth,
          cropHeight,
          0,
          0,
          cropWidth,
          cropHeight
        );
        const url = cropCanvas.toDataURL('image/png');
        if (!cancelled) setCroppedSrc(url);
      } catch (e) {
        if (!cancelled) setFailed(true);
      }
    };
    img.onerror = () => { if (!cancelled) setFailed(true); };
    img.src = src;
    return () => { cancelled = true; };
  }, [src]);

  const appliedSrc = failed ? src : (croppedSrc || src);

  return (
    <img
      src={appliedSrc}
      alt={alt}
      style={{ height, width: 'auto' }}
      className={`block object-contain ${className}`}
      loading="lazy"
    />
  );
};

export default BrandLogo;
