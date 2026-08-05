import { memo, useCallback, useEffect, useRef, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Keyboard, Zoom, A11y } from "swiper/modules";
import { X, ChevronLeft, ChevronRight } from "lucide-react";

import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/zoom";
import "./Lightbox.scss";

function LightboxComponent({
  items = [],
  initialIndex = 0,
  isOpen,
  onClose,
}) {
  const prevRef = useRef(null);
  const nextRef = useRef(null);
  const [swiperInstance, setSwiperInstance] = useState(null);

  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    function handleKeyDown(e) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  useEffect(() => {
    if (!swiperInstance || !prevRef.current || !nextRef.current) return;
    swiperInstance.params.navigation.prevEl = prevRef.current;
    swiperInstance.params.navigation.nextEl = nextRef.current;
    swiperInstance.navigation.destroy();
    swiperInstance.navigation.init();
    swiperInstance.navigation.update();
  }, [swiperInstance]);

  useEffect(() => {
    if (!isOpen || !swiperInstance) return;
    const target = initialIndex;
    if (swiperInstance.params.loop) {
      swiperInstance.slideToLoop(target, 0);
    } else {
      swiperInstance.slideTo(target, 0);
    }
  }, [isOpen, initialIndex, swiperInstance]);

  const playActiveVideo = useCallback((swiper) => {
    const slides = swiper?.slides;
    if (!slides) return;
    slides.forEach((slide) => {
      const video = slide.querySelector("video");
      if (video) {
        video.pause();
        video.currentTime = 0;
      }
    });
    const active = swiper.slides[swiper.activeIndex];
    const activeVideo = active?.querySelector("video");
    if (activeVideo) {
      activeVideo.muted = true;
      activeVideo.play().catch(() => {});
    }
  }, []);

  const handleBackdropClick = useCallback(
    (e) => {
      if (e.target === e.currentTarget) onClose();
    },
    [onClose]
  );

  if (!isOpen || items.length === 0) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Project media gallery"
      className="project-lightbox"
      onClick={handleBackdropClick}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close gallery"
        className="project-lightbox__close"
      >
        <X className="project-lightbox__close-icon" strokeWidth={1.5} />
      </button>

      <button
        ref={prevRef}
        type="button"
        className="project-lightbox__nav project-lightbox__nav--prev"
        aria-label="Previous slide"
      >
        <ChevronLeft
          className="project-lightbox__nav-icon"
          strokeWidth={1.5}
        />
      </button>

      <button
        ref={nextRef}
        type="button"
        className="project-lightbox__nav project-lightbox__nav--next"
        aria-label="Next slide"
      >
        <ChevronRight
          className="project-lightbox__nav-icon"
          strokeWidth={1.5}
        />
      </button>

      <div
        className="project-lightbox__frame"
        onClick={(e) => e.stopPropagation()}
      >
        <Swiper
          modules={[Navigation, Pagination, Keyboard, Zoom, A11y]}
          onSwiper={(swiper) => {
            setSwiperInstance(swiper);
            setTimeout(() => playActiveVideo(swiper), 50);
          }}
          onBeforeInit={(swiper) => {
            swiper.params.navigation.prevEl = prevRef.current;
            swiper.params.navigation.nextEl = nextRef.current;
          }}
          onSlideChange={playActiveVideo}
          initialSlide={initialIndex}
          loop={items.length > 1}
          grabCursor
          zoom
          keyboard={{ enabled: true }}
          pagination={{ clickable: true }}
          navigation={{
            prevEl: prevRef.current,
            nextEl: nextRef.current,
          }}
          className="project-lightbox__swiper"
        >
          {items.map((item, index) => (
            <SwiperSlide key={`${item.type}-${index}`}>
              <div className="swiper-zoom-container project-lightbox__slide-inner">
                {item.type === "video" ? (
                  <video
                    src={item.src}
                    muted
                    controls
                    playsInline
                    className="project-lightbox__media"
                  />
                ) : (
                  <img
                    src={item.src}
                    alt={`Gallery item ${index + 1}`}
                    className="project-lightbox__media"
                  />
                )}
              </div>
            </SwiperSlide>
          ))}
        </Swiper>
      </div>
    </div>
  );
}

export const Lightbox = memo(LightboxComponent);
export const ProjectLightbox = Lightbox;