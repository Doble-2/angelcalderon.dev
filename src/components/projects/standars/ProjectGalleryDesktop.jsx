import ImageModal from "./ImageModal.jsx";

export default function ProjectGalleryDesktop({ images = [], name = "" }) {
  return (
    <div className="space-y-6">
      {images.map((img, i) => (
        <div key={img} className="flex items-center justify-center  rounded-2xl overflow-hidden  w-full " >
          <ImageModal src={img} alt={`${name} ${i}`} fixed={false} />
        </div>
      ))}
    </div>
  );
}
