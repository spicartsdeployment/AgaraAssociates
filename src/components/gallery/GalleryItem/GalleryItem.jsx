import { Play } from "lucide-react";
import "./GalleryItem.scss";

export function GalleryItem({ item, index, onOpen }) {
  return (
    <button
      type="button"
      onClick={() => onOpen(index)}
      className="project-gallery__item"
    >
      {item.type === "video" ? (
        <div className="project-gallery__video-wrap">
          <video
            src={item.src}
            muted
            playsInline
            preload="metadata"
            className="project-gallery__media"
          />
          <span className="project-gallery__play-overlay">
            <span className="project-gallery__play-btn">
              <Play className="project-gallery__play-icon" />
            </span>
          </span>
        </div>
      ) : (
        <img
          src={item.src}
          alt={`Project gallery ${index + 1}`}
          loading="lazy"
          className="project-gallery__media"
        />
      )}
    </button>
  );
}