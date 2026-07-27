import React, { useState } from 'react';
import { 
  Play, 
  Pause, 
  Quote, 
  ExternalLink,
  Sparkles,
  Heart
} from 'lucide-react';
const thumbnailPath = '/wales_workshop_exact_photo_1785063346660.jpg';
const videoPath = '/wales_workshop_video.mp4';

export const PlaceShowcaseVideo: React.FC = () => {
  const [isPlaying, setIsPlaying] = useState(false);

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
                {/* Photo Thumbnail from Workshop - Exact photo */}
                <img 
                  src={thumbnailPath} 
                  alt="Wales Workshop Co-design Session" 
                  className="absolute inset-0 w-full h-full object-cover transition duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />

                {/* Center Play Button Overlay with Logo Teal (#29B6BD) */}
                <div className="absolute inset-0 m-auto w-16 h-16 sm:w-18 sm:h-18 rounded-full bg-[#29B6BD] hover:bg-[#22979d] text-white flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300 border-2 border-white z-20">
                  <Play className="w-8 h-8 fill-current ml-1" />
                </div>
              </div>
            ) : (
              /* REAL HTML5 VIDEO PLAYER WITH CONTROLS */
              <div className="absolute inset-0 bg-black flex items-center justify-center">
                <video 
                  src={videoPath}
                  poster={thumbnailPath}
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  onError={(e) => {
                    // Fallback to sample preview if local video file is empty placeholder
                    const target = e.currentTarget;
                    const sampleUrl = "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4";
                    if (target.src !== sampleUrl) {
                      target.src = sampleUrl;
                    }
                  }}
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT SIDE: Single Unified Box containing Quote, What Has Been Done, & So-Motive Credits */}
        <div className="lg:col-span-6 flex flex-col">
          <div className="h-full bg-slate-50/80 border border-[#e1e1db] rounded-2xl p-6 flex flex-col justify-between space-y-5 shadow-2xs">
            
            {/* 1. OUTSTANDING & ATTRACTIVE QUOTE */}
            <div className="space-y-2 relative pt-2">
              <Quote className="w-10 h-10 text-[#29B6BD]/25 absolute -top-3 -left-2 rotate-180" />
              <blockquote className="pl-7 text-xl sm:text-2xl font-extrabold tracking-tight leading-snug italic text-transparent bg-clip-text bg-gradient-to-r from-[#177277] via-[#29B6BD] to-[#258732]">
                There is talent in Wales, we're just not using it.
              </blockquote>
            </div>

            {/* 2. WHAT HAS BEEN DONE IN WALES */}
            <div className="pt-4 border-t border-[#e1e1db]/80 space-y-2">
              <h4 className="text-xs font-bold text-[#1a2521] uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-[#F89E1B]" />
                <span>What Has Been Done in Wales</span>
              </h4>
              <p className="text-xs text-[#51615a] leading-relaxed">
                Bringing together youth leaders, local authorities, employers, and community partners in Cardiff to co-design tangible pathways from school and education directly into meaningful local employment.
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
