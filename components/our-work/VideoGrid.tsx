"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { useVideoModal } from "@/lib/video-modal-context";

interface VideoItem {
  id: number;
  title: string;
  videoUrl: string;
  thumbnail?: string; // Make thumbnail optional since we'll generate it
}

// Video data with new URLs and camel case titles
const VIDEOS: VideoItem[] = [
  {
    id: 1,
    title: "Bajio",
    videoUrl: "https://blo3rw5wwgi5exel.public.blob.vercel-storage.com/videos/bajio-test.mp4",
  },
  {
    id: 2,
    title: "Stealth Batteries",
    videoUrl: "https://blo3rw5wwgi5exel.public.blob.vercel-storage.com/videos/bass-clown-hero.mp4",
  },
  {
    id: 3,
    title: "F8 Lifted Tournament",
    videoUrl: "https://blo3rw5wwgi5exel.public.blob.vercel-storage.com/videos/f8-lifted-tournement.mp4",
  },
  {
    id: 4,
    title: "WB Derby Reel",
    videoUrl: "https://blo3rw5wwgi5exel.public.blob.vercel-storage.com/videos/wb-derby-reel.mp4",
  },
  {
    id: 5,
    title: "Wicked Bass Ghost Of Jighead Jones",
    videoUrl: "https://blo3rw5wwgi5exel.public.blob.vercel-storage.com/videos/wicked-bass-ghost-of-jighead-jones.mp4",
  },
  {
    id: 6,
    title: "Wicked Bass Large Mouth",
    videoUrl: "https://blo3rw5wwgi5exel.public.blob.vercel-storage.com/videos/wicked-bass-large-mouth.mp4",
  },
];

// Custom hook for generating video thumbnails
const useVideoThumbnail = (videoUrl: string) => {
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const generateThumbnail = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        const video = document.createElement('video');
        video.crossOrigin = 'anonymous';
        video.preload = 'metadata';
        
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        
        if (!ctx) {
          throw new Error('Could not get canvas context');
        }

        video.onloadedmetadata = () => {
          // Set canvas dimensions to a standard aspect ratio (16:9) for consistency
          const targetWidth = 640;
          const targetHeight = 360;
          canvas.width = targetWidth;
          canvas.height = targetHeight;
          
          // Seek to 2 seconds or 10% of video duration, whichever is smaller
          const seekTime = Math.min(2, video.duration * 0.1);
          video.currentTime = seekTime;
        };

        video.onseeked = () => {
          try {
            // Calculate scaling to fit video within canvas (contain behavior)
            const videoAspect = video.videoWidth / video.videoHeight;
            const canvasAspect = canvas.width / canvas.height;
            
            let drawWidth, drawHeight, drawX, drawY;
            
            if (videoAspect > canvasAspect) {
              // Video is wider than canvas
              drawWidth = canvas.width;
              drawHeight = canvas.width / videoAspect;
              drawX = 0;
              drawY = (canvas.height - drawHeight) / 2;
            } else {
              // Video is taller than canvas
              drawHeight = canvas.height;
              drawWidth = canvas.height * videoAspect;
              drawX = (canvas.width - drawWidth) / 2;
              drawY = 0;
            }
            
            // Fill background with black
            ctx.fillStyle = '#000000';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            
            // Draw video frame with proper scaling (contain behavior)
            ctx.drawImage(video, drawX, drawY, drawWidth, drawHeight);
            
            // Convert canvas to blob URL
            canvas.toBlob((blob) => {
              if (blob) {
                const thumbnailUrl = URL.createObjectURL(blob);
                setThumbnail(thumbnailUrl);
              } else {
                setError('Failed to generate thumbnail');
              }
              setIsLoading(false);
            }, 'image/jpeg', 0.8);
          } catch (err) {
            setError('Failed to capture video frame');
            setIsLoading(false);
          }
        };

        video.onerror = () => {
          setError('Failed to load video');
          setIsLoading(false);
        };

        video.src = videoUrl;
      } catch (err) {
        setError('Failed to generate thumbnail');
        setIsLoading(false);
      }
    };

    generateThumbnail();

    // Cleanup function to revoke blob URLs
    return () => {
      if (thumbnail) {
        URL.revokeObjectURL(thumbnail);
      }
    };
  }, [videoUrl]);

  return { thumbnail, isLoading, error };
};

// Video thumbnail component
const VideoThumbnail = ({ video }: { video: VideoItem }) => {
  const { thumbnail, isLoading, error } = useVideoThumbnail(video.videoUrl);

  if (error) {
    // Fallback to static placeholder on error
    return (
      <Image
        src="/images/assets/video-reel-1.svg"
        alt={video.title}
        fill
        className="object-cover"
      />
    );
  }

  if (isLoading) {
    // Show loading state
    return (
      <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  if (thumbnail) {
    return (
      <Image
        src={thumbnail}
        alt={video.title}
        fill
        className="object-contain bg-black"
        unoptimized // Since we're using blob URLs
      />
    );
  }

  // Fallback
  return (
    <Image
      src="/images/assets/video-reel-1.svg"
      alt={video.title}
      fill
      className="object-cover"
    />
  );
};

export const VideoGrid = () => {
  const videoRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("show");
          }
        });
      },
      { threshold: 0.1 }
    );

    videoRefs.current.forEach((ref) => {
      if (ref) observer.observe(ref);
    });

    return () => {
      videoRefs.current.forEach((ref) => {
        if (ref) observer.unobserve(ref);
      });
    };
  }, []);

  const { openVideoModal } = useVideoModal();

  const handlePlayClick = (video: VideoItem) => {
    openVideoModal({
      videoSrc: video.videoUrl,
      title: video.title,
      description: "Bass Clown Co. Production",
      category: "Commercial",
    });
  };

  return (
    <>
      <section className="bg-black py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {VIDEOS.map((video, index) => (
              <div
                key={video.id}
                ref={(el) => {
                  videoRefs.current[index] = el;
                }}
                className="project-card bg-black overflow-hidden"
              >
                {/* Video thumbnail with play button */}
                <div className="relative h-64 bg-black">
                  <VideoThumbnail video={video} />
                  <button
                    onClick={() => handlePlayClick(video)}
                    className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
                    aria-label={`Play ${video.title}`}
                  >
                    <div className="w-12 h-12 bg-red-600 rounded-full flex items-center justify-center transition-transform hover:scale-110">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill="white"
                        className="w-6 h-6"
                        style={{ marginLeft: "2px" }}
                      >
                        <path d="M8 5v14l11-7z" />
                      </svg>
                    </div>
                  </button>
                </div>

                {/* Video title only - description removed */}
                <div className="p-4">
                  <h3 className="text-xl md:text-3xl font-thin text-center text-white mb-2 title-text">{video.title}</h3>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>
    </>
  );
};
