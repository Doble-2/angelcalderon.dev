import { useState } from "react";
import ImageModal from "./ImageModal.jsx";

export default function ProjectGalleryMobile({ images = [], name = "" }) {
  const [selected, setSelected] = useState(0);
  return (
    <div className="w-full flex flex-col items-center pt-12">
      <div className="rounded-xl overflow-hidden shadow-md max-w-[400px] w-full mb-2">
        <ImageModal src={images[selected]} alt={name} />
      </div>
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 hide-scrollbar">
          {images.map((img, i) => (
            <button
              key={img}
              className={`rounded-md border border-gray-200 flex-shrink-0 focus:outline-none ${selected === i ? 'ring-2 ring-accent' : ''}`}
              onClick={() => setSelected(i)}
              aria-label={`Ver imagen ${i + 1}`}
            >
              <img src={img} alt={`${name} thumbnail ${i}`} className="w-20 h-16 object-cover rounded-md" loading="lazy" />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
