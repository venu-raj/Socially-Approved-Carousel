"use client";

import React, { useState, useEffect } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { SkeletonCard, VideoCard } from "./VideoCard";
import { motion } from "framer-motion";
import { useVideos } from "@/hooks/useVideos";
import { useVideoStore } from "@/store/videoStore";

export default function VideoCarousel() {
  const [page] = React.useState(1);
  const limit = 50;
  const [mounted, setMounted] = useState(false);

  const { videos, isLoading, isError } = useVideos(page, limit);
  const openModal = useVideoStore((state) => state.openModal);

  const [emblaRef, emblaApi] = useEmblaCarousel({
    align: "start",
    slidesToScroll: 1,
    containScroll: false,
    dragFree: false,
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="relative mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-serif">
            Loved by community
          </h2>
        </div>
        <div className="flex gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="min-w-70 sm:min-w-[320px] md:min-w-70">
              <SkeletonCard />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="relative mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8 flex items-center justify-between">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-serif">
            Loved by community
          </h2>
          <div className="flex gap-2">
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
            <div className="h-10 w-10 rounded-full bg-muted animate-pulse" />
          </div>
        </div>
        <div className="flex gap-4 sm:gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="min-w-70 sm:min-w-[320px] md:min-w-70">
              <SkeletonCard />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="relative mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-serif">
            Loved by community
          </h2>
        </div>
        <div className="text-center text-destructive">
          <p className="text-lg font-semibold">Error loading videos</p>
          <p className="text-sm text-muted-foreground">
            Please try again later
          </p>
        </div>
      </div>
    );
  }

  if (videos.length === 0) {
    return (
      <div className="relative mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-serif">
            Loved by community
          </h2>
        </div>
        <div className="text-center text-muted-foreground">
          <p className="text-lg font-semibold">No videos yet</p>
          <p className="text-sm">Check back later for community content</p>
        </div>
      </div>
    );
  }

  return (
    <div className="relative mx-auto w-full max-w-[1800px] px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground font-serif">
          Loved by community
        </h2>
        <div className="flex gap-2">
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/50 backdrop-blur transition-colors hover:bg-accent hover:text-accent-foreground"
            onClick={() => emblaApi?.scrollPrev()}
            aria-label="Previous videos"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
          <button
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card/50 backdrop-blur transition-colors hover:bg-accent hover:text-accent-foreground"
            onClick={() => emblaApi?.scrollNext()}
            aria-label="Next videos"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="m9 18 6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="overflow-hidden" ref={emblaRef}>
        <div className="flex touch-pan-y gap-3 sm:gap-4">
          {videos.map((video, idx) => (
            <motion.div
              key={video.id}
              className="min-w-50 sm:min-w-60 md:min-w-55"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.05 }}
            >
              <VideoCard video={video} onClick={() => openModal(idx)} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
