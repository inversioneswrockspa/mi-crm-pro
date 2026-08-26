import React, { useState } from 'react';
import { motion } from 'motion/react';
import { getSafeImageUrl } from '../lib/utils';

interface ProductGalleryProps {
  images: string[];
  description: string;
}

export const ProductGallery: React.FC<ProductGalleryProps> = ({ images, description }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  
  if (!images || images.length === 0) return null;
  
  const currentImage = images[activeIndex];
  const displayUrl = getSafeImageUrl(currentImage);

  return (
    <div className="flex flex-col items-center gap-4 w-full p-2">
      <div className="relative group/gallery w-full max-w-[300px] aspect-square rounded-2xl overflow-hidden border border-slate-200 bg-white shadow-xl ring-1 ring-slate-900/5">
        <motion.img 
          key={activeIndex}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          src={displayUrl} 
          alt={description} 
          className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" 
        />
      </div>
      
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto py-2 scrollbar-hide snap-x w-full justify-center max-w-full">
          {images.map((img, idx) => {
            const thumbUrl = getSafeImageUrl(img);
            return (
              <button
                key={idx}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(idx);
                }}
                className={`w-12 h-12 rounded-lg border-2 flex-shrink-0 overflow-hidden transition-all snap-center ${activeIndex === idx ? 'border-emerald-500 scale-105 shadow-sm' : 'border-slate-100 opacity-60 hover:opacity-100 focus:outline-none'}`}
              >
                  <img src={thumbUrl} alt="" className="w-full h-full object-cover" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
};
