import { useState } from "react";

export default function ImageModal({ src, alt, fixed = false }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      {fixed ? (
        <img
          src={src}
          alt={alt}
          className="object-scale-down"
          loading="lazy"
        />
      ) : (
        <img
          src={src}
          alt={alt}
          className="cursor-zoom-in max-h[600px] object-scale-down"
          onClick={() => setOpen(true)}
          loading="lazy"
        />
      )}
      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80" onClick={() => setOpen(false)}>
          <div className=" rounded-lg shadow-2xl flex items-center justify-center" style={{ width: '90vw', height: '80vh', maxWidth: 600, maxHeight: 600 }}>
            <img
              src={src}
              alt={alt}
              className="w-full h-full object-contain cursor-zoom-out"
              style={{ width: '100%', height: '100%' }}
            />
          </div>
        </div>
      )}
    </>
  );
}
