"use client";

import { useEffect, useCallback, useState, memo } from "react";
import { useVideoStore } from "@/store/videoStore";
import useEmblaCarousel from "embla-carousel-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import VideoPlayer from "./VideoPlayer";
import { Video } from "@/lib/api/client";
import { useVideos } from "@/hooks/useVideos";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const ModalSlide = memo(function ModalSlide({
  video,
  idx,
  distance,
  isActive,
  onActivate,
}: {
  video: Video;
  idx: number;
  distance: number;
  isActive: boolean;
  onActivate: (index: number) => void;
}) {
  const shouldLoad = distance <= 1;

  return (
    <div
      className="relative h-full flex-[0_0_100%] md:flex-[0_0_33.333%] flex items-center justify-center cursor-pointer"
      style={{
        padding: "0 4px",
      }}
      onClick={() => !isActive && onActivate(idx)}
    >
      <div
        className={`h-full w-auto max-w-full aspect-9/16 overflow-hidden rounded-lg transition-all duration-500 ease-out ${
          isActive
            ? "scale-100 opacity-100 z-10"
            : "scale-80 opacity-70 z-0 hover:opacity-90"
        }`}
        style={{
          transform: isActive ? "scale(1) translateY(0)" : "scale(0.8)",
        }}
      >
        <VideoPlayer
          video={video}
          isActive={isActive}
          shouldLoad={shouldLoad}
          onActivate={() => onActivate(idx)}
        />

        {!isActive && (
          <div className="absolute inset-0 bg-black/30 rounded-lg pointer-events-none" />
        )}
      </div>
    </div>
  );
});

ModalSlide.displayName = "ModalSlide";

export default function ModalCarousel() {
  const { isModalOpen, activeIndex, closeModal } = useVideoStore();
  const [currentSlide, setCurrentSlide] = useState(activeIndex);
  const [mounted, setMounted] = useState(false);
  const isMobile = useMediaQuery("(max-width: 767px)");

  const { videos, isLoading, isError } = useVideos(1, 50);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    axis: isMobile ? "y" : "x",
    startIndex: activeIndex,
    align: "center",
    containScroll: false,
    dragFree: false,
    skipSnaps: false,
    loop: false,
    duration: 30,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (emblaApi) {
      emblaApi.reInit({
        axis: isMobile ? "y" : "x",
      });
    }
  }, [isMobile, emblaApi]);

  useEffect(() => {
    if (emblaApi && isModalOpen && mounted) {
      requestAnimationFrame(() => {
        emblaApi.scrollTo(activeIndex, true);
        setCurrentSlide(activeIndex);
      });
    }
  }, [emblaApi, isModalOpen, activeIndex, mounted]);

  useEffect(() => {
    if (!emblaApi) return;

    const onSelect = () => {
      const selectedIndex = emblaApi.selectedScrollSnap();
      setCurrentSlide(selectedIndex);
    };

    emblaApi.on("select", onSelect);
    emblaApi.on("reInit", onSelect);
    onSelect();

    return () => {
      emblaApi.off("select", onSelect);
      emblaApi.off("reInit", onSelect);
    };
  }, [emblaApi]);

  useEffect(() => {
    if (!isModalOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case "Escape":
          closeModal();
          break;
        case "ArrowLeft":
          if (!isMobile) emblaApi?.scrollPrev();
          break;
        case "ArrowRight":
          if (!isMobile) emblaApi?.scrollNext();
          break;
        case "ArrowUp":
          if (isMobile) emblaApi?.scrollPrev();
          break;
        case "ArrowDown":
          if (isMobile) emblaApi?.scrollNext();
          break;
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isModalOpen, emblaApi, closeModal, isMobile]);

  const handleActivate = useCallback(
    (index: number) => {
      if (emblaApi) {
        emblaApi.scrollTo(index);
      }
    },
    [emblaApi],
  );

  const handlePrev = useCallback(() => {
    emblaApi?.scrollPrev();
  }, [emblaApi]);

  const handleNext = useCallback(() => {
    emblaApi?.scrollNext();
  }, [emblaApi]);

  if (!mounted || !isModalOpen) return null;

  if (isLoading) {
    return (
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  if (isError || !videos || videos.length === 0) {
    return (
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 backdrop-blur-2xl"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <button
              onClick={closeModal}
              className="absolute right-4 top-4 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md"
              aria-label="Close modal"
            >
              <X className="h-6 w-6" />
            </button>
            <div className="text-center text-white">
              <p className="text-lg font-semibold mb-2">
                {isError ? "Error loading videos" : "No videos available"}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    );
  }

  return (
    <AnimatePresence>
      {isModalOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-lg"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
        >
          <button
            onClick={closeModal}
            className="absolute right-[8%] top-[6%] z-50 flex h-10 w-10 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition-colors hover:bg-white/20"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>

          {!isMobile ? (
            <>
              {currentSlide > 0 && (
                <button
                  onClick={handlePrev}
                  className="absolute left-[6%] top-1/2 z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-white/20"
                  aria-label="Previous video"
                >
                  <ChevronLeft className="h-6 w-6" />
                </button>
              )}
              {currentSlide < videos.length - 1 && (
                <button
                  onClick={handleNext}
                  className="absolute right-[6%] top-1/2 z-50 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-white/20"
                  aria-label="Next video"
                >
                  <ChevronRight className="h-6 w-6" />
                </button>
              )}
            </>
          ) : (
            <>
              {currentSlide > 0 && (
                <button
                  onClick={handlePrev}
                  className="absolute top-[6%] left-1/2 z-50 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-white/20"
                  aria-label="Previous video"
                >
                  <ChevronUp className="h-6 w-6" />
                </button>
              )}
              {currentSlide < videos.length - 1 && (
                <button
                  onClick={handleNext}
                  className="absolute bottom-[6%] left-1/2 z-50 flex h-10 w-10 -translate-x-1/2 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md hover:bg-white/20"
                  aria-label="Next video"
                >
                  <ChevronDown className="h-6 w-6" />
                </button>
              )}
            </>
          )}

          <div className="relative w-[80%] h-[80%] max-w-7xl mx-auto flex items-center overflow-hidden">
            <div className="w-full h-full overflow-hidden" ref={emblaRef}>
              <div
                className={`flex ${isMobile ? "flex-col h-full" : "h-full items-center"}`}
                style={{
                  gap: "0px",
                }}
              >
                {videos.map((video, idx) => {
                  const isActive = idx === currentSlide;
                  const distance = Math.abs(idx - currentSlide);
                  return (
                    <ModalSlide
                      key={video.id}
                      video={video}
                      idx={idx}
                      distance={distance}
                      isActive={isActive}
                      onActivate={handleActivate}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
