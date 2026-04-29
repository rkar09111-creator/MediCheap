import React from 'react';
import { Upload, X, Star, GripVertical, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const ProductImageManager = ({ images, onChange }) => {
  const handleUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange([...images, reader.result]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleRemove = (index) => {
    onChange(images.filter((_, i) => i !== index));
  };

  const setAsCover = (index) => {
    const newImages = [...images];
    const item = newImages.splice(index, 1)[0];
    newImages.unshift(item);
    onChange(newImages);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <label className="text-[10px] font-black text-neutral-400 uppercase tracking-widest">Product Visual Gallery</label>
        <span className="text-[9px] font-bold text-neutral-400 uppercase">{images.length}/10 Images</span>
      </div>

      {/* Upload Zone */}
      <div className="relative group">
        <div className="aspect-video rounded-[2rem] border-2 border-dashed border-neutral-200 group-hover:border-brand-green group-hover:bg-brand-green/5 transition-all flex flex-col items-center justify-center gap-3 cursor-pointer overflow-hidden">
           <div className="w-12 h-12 rounded-2xl bg-neutral-50 group-hover:bg-white flex items-center justify-center text-neutral-300 group-hover:text-brand-green transition-all">
              <Upload size={24} />
           </div>
           <div className="text-center">
              <p className="text-xs font-black text-neutral-900 uppercase">Drop Product Images</p>
              <p className="text-[10px] font-bold text-neutral-400 uppercase mt-1 tracking-tight">PNG, JPG, WEBP • Max 5MB</p>
           </div>
        </div>
        <input 
          type="file" 
          multiple 
          className="absolute inset-0 opacity-0 cursor-pointer" 
          onChange={handleUpload}
          disabled={images.length >= 10}
        />
      </div>

      {/* Grid of Uploaded Images */}
      <div className="grid grid-cols-3 gap-3">
        <AnimatePresence mode="popLayout">
          {images.map((img, index) => (
            <motion.div
              layout
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="aspect-square rounded-2xl border border-neutral-100 overflow-hidden relative group bg-white"
            >
              <img src={img} alt="" className="w-full h-full object-contain p-2" />
              
              {index === 0 && (
                <div className="absolute top-2 left-2 bg-brand-green text-white text-[8px] font-black px-2 py-0.5 rounded-full uppercase tracking-tighter shadow-sm z-10">
                  Cover
                </div>
              )}

              <div className="absolute inset-0 bg-neutral-900/60 opacity-0 group-hover:opacity-100 transition-all flex items-center justify-center gap-2">
                 {index !== 0 && (
                   <button 
                    type="button"
                    onClick={() => setAsCover(index)}
                    className="p-1.5 bg-white text-neutral-900 rounded-lg hover:scale-110 transition-transform"
                    title="Set as Cover"
                   >
                     <Star size={14} />
                   </button>
                 )}
                 <button 
                  type="button"
                  onClick={() => handleRemove(index)}
                  className="p-1.5 bg-red-500 text-white rounded-lg hover:scale-110 transition-transform"
                  title="Remove Image"
                 >
                   <X size={14} />
                 </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {images.length < 3 && Array.from({ length: 3 - images.length }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square rounded-2xl bg-neutral-50 border border-neutral-100 flex items-center justify-center text-neutral-200">
             <ImageIcon size={20} />
          </div>
        ))}
      </div>
      
      <p className="text-[9px] text-neutral-400 font-bold uppercase tracking-wide text-center">Drag images to reorder. First image is the public thumbnail.</p>
    </div>
  );
};

export default ProductImageManager;
