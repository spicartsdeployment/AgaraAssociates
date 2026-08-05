import { memo, useCallback, useMemo, useState } from "react";
import { GalleryGrid } from "@/components/gallery/GalleryGrid";
import { Lightbox } from "@/components/gallery/Lightbox";
import "./ProjectGallery.scss";

function ProjectGalleryComponent({ images = [] }) {
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);

  const items = useMemo(
    () =>
      (images || []).filter(
        (item) => item?.src && (item.type === "image" || item.type === "video")
      ),
    [images]
  );

  const openAt = useCallback((index) => {
    setActiveIndex(index);
    setLightboxOpen(true);
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxOpen(false);
  }, []);

  if (items.length === 0) return null;

  return (
    <>
      <div className="project-gallery">
        <p className="project-gallery__eyebrow">Gallery</p>
        <h2 className="project-gallery__title">Project Media</h2>

        <GalleryGrid items={items} onOpen={openAt} />
      </div>

      <Lightbox
        items={items}
        initialIndex={activeIndex}
        isOpen={lightboxOpen}
        onClose={closeLightbox}
      />
    </>
  );
}

export const ProjectGallery = memo(ProjectGalleryComponent);