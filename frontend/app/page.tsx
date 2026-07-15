"use client";

import VideoCarousel from "@/components/home/VideoCarousel";
import ModalCarousel from "@/components/home/ModalCarousel";

export default function Home() {
  return (
    <div>
      <VideoCarousel />
      <div className="flex items-center justify-center gap-1.5 text-neutral-600 sm:gap-2 dark:text-neutral-300 py-6 sm:py-8">
        <h2 className="text-xl font-semibold text-muted-foreground font-serif">
          100% customer satisfaction rate
        </h2>
        <svg
          viewBox="0 0 120 80"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="h-14 w-20 sm:h-20 sm:w-30"
          style={{ transform: "scale(-1, -1)" }}
        >
          <path d="M110 18 C70 0, 20 20, 12 60" strokeDasharray="6 6" />
          <path d="M4 48l8 14" />
          <path d="M28 56l-16 6" />
        </svg>
      </div>
      <ModalCarousel />
    </div>
  );
}
