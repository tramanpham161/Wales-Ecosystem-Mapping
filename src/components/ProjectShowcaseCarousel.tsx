import React, { useState, useEffect } from 'react';
import { ChevronRight, ChevronLeft, Quote, Sparkles, Award } from 'lucide-react';

interface ShowcaseProject {
  id: string;
  photos: string[]; // 3 photos per project: e.g. ['EL-1-1.jpg', 'EL-1-2.jpg', 'EL-1-3.jpg']
  title: string;
  partner: string;
  stage: string;
  quote: string;
  author: string;
  role: string;
  metric: string;
  bgGradient: string;
}

const SHOWCASE_PROJECTS: ShowcaseProject[] = [
  {
    id: 'EL-1',
    photos: ['EL-1-1.jpg', 'EL-1-2.jpg', 'EL-1-3.jpg'],
    title: 'North Wales Green Apprenticeship Pathway',
    partner: 'Coleg Menai & North Wales Renewables Trust',
    stage: 'Stage 3: Skills Bridge',
    quote: 'Connecting local green energy employers directly into our bilingual apprenticeships transformed learner completion rates from 45% to 92% in 12 months.',
    author: 'Eira Roberts',
    role: 'Lead Pathways Coordinator, North Wales',
    metric: '140 Youth Placed • 92% Completion Rate',
    bgGradient: 'from-teal-500 via-emerald-600 to-cyan-600',
  },
  {
    id: 'EL-2',
    photos: ['EL-2-1.jpg', 'EL-2-2.jpg', 'EL-2-3.jpg'],
    title: 'Rhondda Valleys Tech Mentorship Network',
    partner: 'Valleys Innovation Alliance & Software Wales',
    stage: 'Stage 2: Foundation',
    quote: 'Removing travel barriers by placing tech mentors directly into community hubs gave 85 young adults their first professional tech portfolio.',
    author: 'Gareth Thomas',
    role: 'Head of Community Tech, Rhondda',
    metric: '85 Mentorships • 18 New Startups',
    bgGradient: 'from-cyan-500 via-sky-600 to-teal-600',
  },
  {
    id: 'EL-3',
    photos: ['EL-3-1.jpg', 'EL-3-2.jpg', 'EL-3-3.jpg'],
    title: 'Aberystwyth Bilingual Digital Media Lab',
    partner: 'S4C Partner Network & Ceredigion Hub',
    stage: 'Stage 4: Industry Placement',
    quote: 'Welsh-first creative media workshops allowed local storytellers to produce paid content for national broadcasters while staying in Ceredigion.',
    author: 'Sian Davies',
    role: 'Creative Director, Ceredigion Media',
    metric: '24 Paid Productions • 100% Welsh Language',
    bgGradient: 'from-teal-600 via-emerald-500 to-teal-700',
  },
];

export const ProjectShowcaseCarousel: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [subPhotoIndex, setSubPhotoIndex] = useState(0);
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const currentProject = SHOWCASE_PROJECTS[currentIndex];
  const currentPhotoFilename = currentProject.photos[subPhotoIndex] || currentProject.photos[0];

  // Auto-advance photos for the current active project every 2 seconds (2000ms)
  useEffect(() => {
    const timer = setInterval(() => {
      setSubPhotoIndex((prev) => (prev + 1) % currentProject.photos.length);
    }, 2000);

    return () => clearInterval(timer);
  }, [currentIndex, currentProject.photos.length]);

  const handleNextProject = () => {
    setCurrentIndex((prev) => (prev + 1) % SHOWCASE_PROJECTS.length);
    setSubPhotoIndex(0);
  };

  const handlePrevProject = () => {
    setCurrentIndex((prev) => (prev - 1 + SHOWCASE_PROJECTS.length) % SHOWCASE_PROJECTS.length);
    setSubPhotoIndex(0);
  };

  const handleImageError = (photoKey: string) => {
    setFailedImages((prev) => ({ ...prev, [photoKey]: true }));
  };

  const photoKey = `${currentProject.id}_${subPhotoIndex}`;
  const hasFailed = failedImages[photoKey];

  return (
    <div className="bg-white border border-[#e1e1db] rounded-2xl overflow-hidden shadow-xs flex flex-col h-full text-left">
      {/* Solid Brand Color Header */}
      <div className="p-4 bg-[#29B6BD] text-white flex items-center justify-between gap-2 shadow-2xs">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-md">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <div>
            <h3 className="text-xs font-black tracking-wide uppercase text-white drop-shadow-xs">
              Project Showcase
            </h3>
            <p className="text-[10px] text-teal-100 font-medium">Completed regional impact evidence</p>
          </div>
        </div>
        
        {/* Pagination Counter Badge */}
        <span className="text-[11px] font-mono font-black bg-white/20 px-2.5 py-1 rounded-xl text-white backdrop-blur-md border border-white/20">
          {currentIndex + 1} / {SHOWCASE_PROJECTS.length}
        </span>
      </div>

      {/* Image Showcase Frame with 2-second Rotating Photos */}
      <div className="relative w-full h-52 sm:h-56 bg-slate-100 overflow-hidden group">
        {!hasFailed ? (
          <img
            key={currentPhotoFilename}
            src={`/${currentPhotoFilename}`}
            alt={`${currentProject.title} photo ${subPhotoIndex + 1}`}
            referrerPolicy="no-referrer"
            onError={() => handleImageError(photoKey)}
            className="w-full h-full object-cover transition-opacity duration-500 animate-fadeIn"
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-br ${currentProject.bgGradient} p-5 flex flex-col justify-between text-white relative`}>
            {/* Soft decorative background element */}
            <div className="absolute -right-10 -top-10 w-36 h-36 rounded-full bg-white/15 pointer-events-none" />
            
            <div className="flex items-center justify-between z-10">
              <span className="text-[10px] font-bold bg-white/25 backdrop-blur-md text-white px-2.5 py-1 rounded-full border border-white/30">
                {currentProject.stage}
              </span>
            </div>

            <div className="z-10 space-y-1">
              <h4 className="text-sm font-bold leading-tight text-white drop-shadow-xs">
                {currentProject.title}
              </h4>
            </div>
          </div>
        )}

        {/* Floating Stage Badge & Sub-Photo Counter on Picture */}
        {!hasFailed && (
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10 pointer-events-none">
            <span className="px-3 py-1 rounded-full bg-[#29B6BD] text-[10px] font-bold text-white shadow-sm border border-white/30">
              {currentProject.stage}
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-black/40 backdrop-blur-md text-[9px] font-mono font-bold text-white/90 border border-white/20">
              Photo {subPhotoIndex + 1}/3
            </span>
          </div>
        )}

        {/* Bottom Sub-Photo Progress Bars (3 photos per project - advances every 2s) */}
        <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-20 flex items-center gap-1.5 px-3 py-1 rounded-full bg-black/30 backdrop-blur-md border border-white/20">
          {currentProject.photos.map((photoFile, pIdx) => (
            <button
              key={photoFile}
              onClick={() => setSubPhotoIndex(pIdx)}
              className={`h-1.5 rounded-full transition-all cursor-pointer ${
                pIdx === subPhotoIndex
                  ? 'w-5 bg-[#29B6BD]'
                  : 'w-1.5 bg-white/50 hover:bg-white'
              }`}
              title={`Switch to photo ${pIdx + 1} (${photoFile})`}
            />
          ))}
        </div>

        {/* Blurred Transparent Navigation Arrows for switching projects */}
        <button
          onClick={handlePrevProject}
          className="absolute left-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/30 hover:bg-black/55 text-white backdrop-blur-md border border-white/30 shadow-md cursor-pointer transition transform active:scale-95 z-20"
          title="Previous Project"
          aria-label="Previous Project"
        >
          <ChevronLeft className="w-4 h-4 text-white" />
        </button>

        <button
          onClick={handleNextProject}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-2.5 rounded-full bg-black/30 hover:bg-black/55 text-white backdrop-blur-md border border-white/30 shadow-md cursor-pointer transition transform active:scale-95 z-20"
          title="Next Project (Click to view next)"
          aria-label="Next Project"
        >
          <ChevronRight className="w-4 h-4 text-white" />
        </button>
      </div>

      {/* Under Picture: Quotes & Project Impact Details */}
      <div className="p-5 flex-1 flex flex-col justify-between space-y-4 bg-white">
        <div className="space-y-3">
          {/* Partner & Title */}
          <div className="space-y-1 pb-2 border-b border-gray-100">
            <span className="inline-block px-2.5 py-0.5 rounded-md bg-teal-50 text-[#176e73] font-bold text-[10px] uppercase tracking-wider">
              {currentProject.partner}
            </span>
            <h4 className="text-xs font-bold text-[#1a2521] leading-snug">
              {currentProject.title}
            </h4>
          </div>

          {/* Redesigned Visually Rich Quote Card */}
          <div className="relative bg-slate-50 border border-slate-200/80 p-4 rounded-2xl shadow-2xs space-y-2">
            <Quote className="w-5 h-5 text-[#29B6BD]/30 absolute top-3 right-3" />
            <p className="text-[11px] italic text-slate-800 leading-relaxed pr-4 font-medium">
              "{currentProject.quote}"
            </p>
            <div className="pt-2 border-t border-slate-200/60 flex items-center justify-between">
              <div>
                <p className="text-[11px] font-extrabold text-[#176e73]">{currentProject.author}</p>
                <p className="text-[9px] text-slate-500 font-medium">{currentProject.role}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Visually Highlighted Outcome Metric */}
        <div className="space-y-3 pt-1">
          <div className="p-3 bg-gradient-to-r from-emerald-500/10 via-teal-500/10 to-emerald-500/15 border border-emerald-300/70 rounded-xl flex items-center gap-2.5 text-emerald-950 text-[11px] font-bold shadow-2xs">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center flex-shrink-0 shadow-2xs">
              <Award className="w-4 h-4" />
            </div>
            <div className="flex-1 min-w-0">
              <span className="text-[9px] uppercase tracking-wider text-emerald-700 block font-bold">Key Outcome Metric</span>
              <span className="text-xs font-black text-emerald-900 truncate block">{currentProject.metric}</span>
            </div>
          </div>

          {/* Carousel Navigation Indicators for switching projects */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center gap-1.5">
              {SHOWCASE_PROJECTS.map((proj, idx) => (
                <button
                  key={proj.id}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setSubPhotoIndex(0);
                  }}
                  className={`h-2 rounded-full transition-all cursor-pointer ${
                    idx === currentIndex
                      ? 'w-7 bg-[#29B6BD]'
                      : 'w-2 bg-gray-200 hover:bg-gray-300'
                  }`}
                  title={`Go to project ${proj.id}`}
                />
              ))}
            </div>

            <button
              onClick={handleNextProject}
              className="text-[11px] font-bold text-[#29B6BD] hover:text-[#1d8e93] flex items-center gap-1 cursor-pointer transition"
            >
              <span>Next Project</span>
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

