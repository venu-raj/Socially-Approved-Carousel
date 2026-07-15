import { memo, useState, useRef, useCallback } from "react";
import { motion } from "framer-motion";
import { Play } from "lucide-react";
import { Video } from "@/lib/api/client";

interface VideoCardProps {
  video: Video;
  onClick: () => void;
}

export const SkeletonCard = memo(() => (
  <div className="relative aspect-9/16 h-70 sm:h-88 shrink-0 overflow-hidden rounded-2xl bg-card border border-border/50">
    <div className="absolute inset-0 animate-pulse bg-muted/20" />
    <div className="absolute bottom-3 left-3 right-3 flex flex-col gap-1.5">
      <div className="h-3.5 w-2/3 animate-pulse rounded bg-muted/30" />
      <div className="h-2.5 w-1/2 animate-pulse rounded bg-muted/30" />
    </div>
  </div>
));
SkeletonCard.displayName = "SkeletonCard";

export const VideoCard = memo(({ video, onClick }: VideoCardProps) => {
  const [hover, setHover] = useState(false);
  const ref = useRef<HTMLVideoElement>(null);
  const t = useRef<NodeJS.Timeout | null>(null);

  const enter = useCallback(() => {
    t.current = setTimeout(() => {
      setHover(true);
      ref.current?.play().catch(() => {});
    }, 300);
  }, []);

  const leave = useCallback(() => {
    t.current && clearTimeout(t.current);
    setHover(false);
    const v = ref.current;
    if (v) {
      v.pause();
      v.currentTime = 0;
    }
  }, []);

  return (
    <motion.div
      className="group relative aspect-9/16 h-70 sm:h-88 shrink-0 cursor-pointer overflow-hidden rounded-2xl border border-border/20 bg-card shadow-lg transition-all hover:border-primary/50"
      onClick={onClick}
      onMouseEnter={enter}
      onMouseLeave={leave}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 25 }}
      data-testid={`video-card-${video.id}`}
    >
      <video
        ref={ref}
        src={video.videoUrl}
        muted
        playsInline
        loop
        preload="metadata"
        className="absolute inset-0 h-full w-full object-cover"
        disablePictureInPicture
        controlsList="nofullscreen nodownload noremoteplayback"
      />
      {!hover && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/10">
          <div className="flex items-center justify-center rounded-full bg-black/30 p-3 text-white backdrop-blur-sm">
            <Play className="h-6 w-6 fill-current opacity-90 ml-0.5" />
          </div>
        </div>
      )}
    </motion.div>
  );
});
VideoCard.displayName = "VideoCard";
