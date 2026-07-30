import React, { useState } from 'react';
import { 
  Play, 
  Quote, 
  ExternalLink,
  Sparkles,
  Heart,
  Video
} from 'lucide-react';

const exactPhoto = '/wales_workshop_exact_photo_1785063346660.jpg';
const thumbnailPhoto = '/wales_workshop_thumbnail_1785063122767.jpg';

interface PlaceShowcaseVideoProps {
  placeName?: 'Wales' | 'Yorkshire';
}

export const PlaceShowcaseVideo: React.FC<PlaceShowcaseVideoProps> = ({ placeName = 'Wales' }) => {
  const isYorkshire = placeName === 'Yorkshire';
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhoto, setCurrentPhoto] = useState(exactPhoto);
  const [videoError, setVideoError] = useState(false);

  // Exact video file paths
  const exactVideoPath = encodeURI('/OAHA_WALES PLACE BASED WORKSHOP 2026_MAIN WRAP-UP FILM_V1.3-2.mp4');
  const fallbackVideoPath = '/wales_workshop_video.mp4';
  const sampleDemoVideo = 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4';

  const handleImageError = () => {
    if (currentPhoto === exactPhoto) {
      setCurrentPhoto(thumbnailPhoto);
    } else if (currentPhoto === thumbnailPhoto) {
      setCurrentPhoto('/OD-1.jpg');
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="w-full bg-white rounded-2xl border border-[#e1e1db] p-5 sm:p-6 shadow-xs">
      {/* 2-column layout: Left = Video Showcase (half width), Right = Unified Content Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
        
        {/* LEFT SIDE: Video Showcase Player (half width: 6 cols on lg) */}
        <div className="lg:col-span-6 flex flex-col justify-center">
          {/* Video Viewport / Waiting Thumbnail */}
          <div 
            className="relative aspect-video w-full bg-[#14231e] rounded-2xl overflow-hidden border border-[#d1d1ca] shadow-sm group select-none"
          >
            {/* THUMBNAIL PREVIEW IMAGE (Shown when waiting to play) */}
            {!isPlaying ? (
              <div 
                onClick={togglePlay}
                className="absolute inset-0 flex items-center justify-center overflow-hidden cursor-pointer"
              >
                {/* Photo Thumbnail from Workshop */}
                <img 
                  src={currentPhoto} 
                  alt="Wales Workshop Co-design Session" 
                  onError={handleImageError}
                  className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Dark overlay gradient for contrast */}
                <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />

                {/* Center Play Button Overlay with Logo Teal (#29B6BD) */}
                <div className="absolute inset-0 m-auto w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#29B6BD] hover:bg-[#22979d] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300 border-2 border-white z-20">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>

                {/* Badge on bottom left */}
                <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-md px-3 py-1 rounded-lg text-[11px] text-white font-medium flex items-center gap-1.5 z-10 border border-white/20">
                  <Video className="w-3.5 h-3.5 text-[#29B6BD]" />
                  <span>{isYorkshire ? 'Yorkshire Place-Based Workshop Wrap-up Film' : 'Wales Place-Based Workshop Wrap-up Film'}</span>
                </div>
              </div>
            ) : (
              /* REAL HTML5 VIDEO PLAYER WITH CONTROLS */
              <div className="absolute inset-0 bg-black flex items-center justify-center">
                <video 
                  controls
                  autoPlay
                  poster={currentPhoto}
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    const target = e.currentTarget;
                    if (target.src !== sampleDemoVideo) {
                      setVideoError(true);
                      target.src = sampleDemoVideo;
                      target.play().catch(() => {});
                    }
                  }}
                >
                  <source src={exactVideoPath} type="video/mp4" />
                  <source src={fallbackVideoPath} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>

          {/* Optional notice if video file is 0 bytes */}
          {videoError && (
            <p className="mt-2 text-[10px] text-amber-700 bg-amber-50 border border-amber-200 rounded-lg p-2 leading-tight">
              ⚠️ Note: The uploaded local video file (<code className="font-mono">public/OAHA_{isYorkshire ? 'YORKSHIRE' : 'WALES'}...mp4</code>) is 0 bytes (empty placeholder). Playing sample video preview instead. Replace the file in <code className="font-mono">public/</code> with your full video.
            </p>
          )}
        </div>

        {/* RIGHT SIDE: Single Unified Box containing Quote, What Has Been Done, & So-Motive Credits */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="h-full bg-slate-50/80 border border-[#e1e1db] rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-2xs">
            
            {/* 1. OUTSTANDING & ATTRACTIVE QUOTE */}
            <div className="space-y-2 relative pt-2">
              <Quote className="w-10 h-10 text-[#29B6BD]/25 absolute -top-3 -left-2 rotate-180" />
              <blockquote className="pl-7 text-xl sm:text-2xl font-extrabold tracking-tight leading-snug italic text-transparent bg-clip-text bg-gradient-to-r from-[#177277] via-[#29B6BD] to-[#258732]">
                {isYorkshire ? "There is talent in Yorkshire, we're just not using it." : "There is talent in Wales, we're just not using it."}
              </blockquote>
            </div>

            {/* 2. WHAT HAS BEEN DONE */}
            <div className="pt-4 border-t border-[#e1e1db]/80 space-y-2">
              <h4 className="text-xs font-bold text-[#1a2521] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F89E1B]" />
                <span>What Has Been Done in {isYorkshire ? 'Yorkshire' : 'Wales'}</span>
              </h4>
              <p className="text-xs text-[#51615a] leading-relaxed">
                {isYorkshire 
                  ? "Bringing together youth leaders, local authorities, employers, and community partners across South and West Yorkshire to co-design tangible pathways from school and education directly into meaningful local employment."
                  : "Bringing together youth leaders, local authorities, employers, and community partners in Cardiff to co-design tangible pathways from school and education directly into meaningful local employment."}
              </p>
            </div>

            {/* 3. SO-MOTIVE CREDITS */}
            <div className="pt-4 border-t border-[#e1e1db]/80 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs text-[#51615a]">
              <div className="flex items-center gap-2">
                <Heart className="w-4 h-4 text-[#3EB049] shrink-0" />
                <span>
                  Thanks to <strong className="text-[#1a2521] font-semibold">So-Motive</strong> for helping us make this incredible video.
                </span>
              </div>

              <a 
                href="https://www.so-motive.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-[#29B6BD] hover:text-[#1e8d93] font-bold hover:underline transition shrink-0"
              >
                <span>so-motive.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};

