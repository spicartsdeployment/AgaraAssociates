import { motion, AnimatePresence } from "framer-motion";
import { Maximize, Volume2, VolumeX, X } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import "./VideoModal.scss";

export function VideoModal({ isOpen, onClose, videoSrc, title, location }) {
  const videoRef = useRef(null);
  const modalRef = useRef(null);
  const closeButtonRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
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
    if (!isOpen || !modalRef.current) return;
    const focusableElements = modalRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    const firstFocusable = focusableElements[0];
    const lastFocusable = focusableElements[focusableElements.length - 1];
    if (closeButtonRef.current) closeButtonRef.current.focus();
    function handleTab(e) {
      if (e.key !== "Tab") return;
      if (e.shiftKey) {
        if (document.activeElement === firstFocusable) {
          e.preventDefault();
          lastFocusable?.focus();
        }
      } else if (document.activeElement === lastFocusable) {
        e.preventDefault();
        firstFocusable?.focus();
      }
    }
    window.addEventListener("keydown", handleTab);
    return () => window.removeEventListener("keydown", handleTab);
  }, [isOpen]);

  const handleExitComplete = useCallback(() => {
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
    setIsMuted(true);
  }, []);

  function handleToggleMute() {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
    }
  }

  function handleFullscreen() {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    } else if (videoRef.current.webkitRequestFullscreen) {
      videoRef.current.webkitRequestFullscreen();
    }
  }

  function handleBackdropClick(e) {
    if (e.target === e.currentTarget) onClose();
  }

  return (
    <AnimatePresence onExitComplete={handleExitComplete}>
      {isOpen && (
        <motion.div
          ref={modalRef}
          role="dialog"
          aria-modal="true"
          aria-label={`${title} project film`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="video-modal"
          onClick={handleBackdropClick}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="video-modal__panel"
          >
            <div className="video-modal__video-wrap">
              <video
                ref={videoRef}
                src={videoSrc}
                autoPlay
                muted
                controls
                loop
                playsInline
                className="video-modal__video"
              />
            </div>

            <button
              ref={closeButtonRef}
              type="button"
              onClick={onClose}
              aria-label="Close video"
              className="video-modal__close-btn"
            >
              <X className="video-modal__close-icon" strokeWidth={1.5} />
            </button>

            <div className="video-modal__gradient" />

            <div className="video-modal__meta">
              <p className="video-modal__meta-label">Featured Project</p>
              <p className="video-modal__meta-title">{title}</p>
              <p className="video-modal__meta-location">{location}</p>
            </div>

            <div className="video-modal__controls">
              <button
                type="button"
                onClick={handleToggleMute}
                aria-label={isMuted ? "Unmute video" : "Mute video"}
                className="video-modal__control-btn"
              >
                {isMuted ? (
                  <VolumeX className="video-modal__control-icon" strokeWidth={1.5} />
                ) : (
                  <Volume2 className="video-modal__control-icon" strokeWidth={1.5} />
                )}
              </button>
              <button
                type="button"
                onClick={handleFullscreen}
                aria-label="Enter fullscreen"
                className="video-modal__control-btn"
              >
                <Maximize className="video-modal__control-icon" strokeWidth={1.5} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}