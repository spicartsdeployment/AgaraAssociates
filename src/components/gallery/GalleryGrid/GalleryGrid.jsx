import { GalleryItem } from "@/components/gallery/GalleryItem";
import "./GalleryGrid.scss";

export function GalleryGrid({ items, onOpen }) {
  return (
    <div className="project-gallery__grid">
      {items.map((item, index) => (
        <GalleryItem
          key={`${item.type}-${index}`}
          item={item}
          index={index}
          onOpen={onOpen}
        />
      ))}
    </div>
  );
}