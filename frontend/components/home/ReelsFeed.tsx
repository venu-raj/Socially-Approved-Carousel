import { useEffect, useRef, useState, useCallback, memo } from "react";
import VideoPlayer from "./VideoPlayer";
import { Video } from "@/lib/api/client";

interface ReelsFeedProps {
  videos: Video[];
}

const LOAD_RADIUS = 1;

const ACTIVE_THRESHOLD = 0.85;

const ReelsFeedItem = memo(function ReelsFeedItem({
  video,
  index,
  isActive,
  shouldLoad,
  onItemRef,
}: {
  video: Video;
  index: number;
  isActive: boolean;
  shouldLoad: boolean;
  onItemRef: (el: HTMLDivElement | null, index: number) => void;
}) {
  const handleRef = useCallback(
    (el: HTMLDivElement | null) => onItemRef(el, index),
    [index, onItemRef],
  );

  return (
    <div
      ref={handleRef}
      data-index={index}
      style={{ height: "100dvh" }}
      className="w-full shrink-0 snap-start snap-always overflow-hidden bg-black"
    >
      <VideoPlayer video={video} isActive={isActive} shouldLoad={shouldLoad} />
    </div>
  );
});

export default function ReelsFeed({ videos }: ReelsFeedProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLDivElement | null)[]>([]);
  const observerRef = useRef<IntersectionObserver | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            const index = Number(entry.target.getAttribute("data-index"));
            if (!isNaN(index)) {
              setActiveIndex(index);
            }
          }
        }
      },
      {
        root: container,
        threshold: ACTIVE_THRESHOLD,
      },
    );

    itemRefs.current.forEach((el) => {
      if (el && observerRef.current) {
        observerRef.current.observe(el);
      }
    });

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [videos.length]);

  const handleItemRef = useCallback(
    (el: HTMLDivElement | null, index: number) => {
      itemRefs.current[index] = el;

      if (el && observerRef.current) {
        observerRef.current.observe(el);
      }
    },
    [],
  );

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-10 w-full overflow-y-scroll snap-y snap-mandatory overscroll-y-contain bg-black"
    >
      {videos.map((video, idx) => {
        const isActive = idx === activeIndex;
        const shouldLoad = Math.abs(idx - activeIndex) <= LOAD_RADIUS;
        return (
          <ReelsFeedItem
            key={video.id}
            video={video}
            index={idx}
            isActive={isActive}
            shouldLoad={shouldLoad}
            onItemRef={handleItemRef}
          />
        );
      })}
    </div>
  );
}
