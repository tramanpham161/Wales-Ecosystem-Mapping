import React from 'react';
import { FrictionPoint } from '../types';

// Stage 1: Baby (Crawling/sitting elegantly)
export function StageBabySvg({ className = "w-20 h-40 text-slate-900" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 160"
      className={`${className} transition-transform duration-300 hover:scale-105`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="50" cy="55" r="14" />
      <path d="M 49,41 Q 52,36 55,40" strokeWidth="2" />
      <path d="M 39,66 C 35,76 34,92 38,100 C 42,108 52,108 58,102 C 64,96 61,78 58,66" />
      <path d="M 38,100 Q 48,106 58,102" strokeWidth="1.5" />
      <path d="M 42,72 Q 54,76 60,70" />
      <path d="M 38,98 Q 42,118 52,118 Q 58,118 56,104" />
      <line x1="20" y1="130" x2="80" y2="130" stroke="#969696" strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  );
}

// Stage 2: Toddler/Young Child (Active walking legs)
export function StageToddlerSvg({ className = "w-20 h-40 text-slate-900" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 160"
      className={`${className} transition-transform duration-300 hover:scale-105`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="50" cy="46" r="12" />
      <path d="M 47,34 Q 50,30 53,33" strokeWidth="2" />
      <path d="M 43,58 L 57,58 L 56,90 H 44 Z" />
      <path d="M 44,90 L 42,102 H 48 L 48,90" />
      <path d="M 50,90 L 49,102 H 55 L 56,90" strokeWidth="2" />
      <path d="M 57,60 Q 64,74 61,84" />
      <path d="M 43,60 Q 37,74 40,84" />
      <path d="M 45,102 L 42,122 H 47" />
      <path d="M 52,102 L 55,122 H 60" />
      <line x1="20" y1="130" x2="80" y2="130" stroke="#969696" strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  );
}

// Stage 3: Schoolchild with Backpack
export function StageSchoolchildSvg({ className = "w-20 h-40 text-slate-900" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 160"
      className={`${className} transition-transform duration-300 hover:scale-105`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="48" cy="42" r="11" />
      <path d="M 43,31 Q 48,27 50,30" strokeWidth="2" />
      <path d="M 42,53 H 56 L 54,92 H 40 Z" />
      <rect x="30" y="55" width="12" height="24" rx="4" stroke="currentColor" strokeWidth="2" />
      <path d="M 36,55 C 36,50 40,50 40,55" strokeWidth="1.5" />
      <path d="M 38,55 C 41,61 43,72 41,80" />
      <path d="M 55,55 Q 61,72 59,84" />
      <path d="M 43,92 L 39,122 H 44" />
      <path d="M 51,92 L 54,122 H 58" />
      <line x1="20" y1="130" x2="80" y2="130" stroke="#969696" strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  );
}

// Stage 4: Teen/Young Adult (Relaxed hoodie & relaxed stance)
export function StageYoungAdultSvg({ className = "w-20 h-40 text-slate-900" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 160"
      className={`${className} transition-transform duration-300 hover:scale-105`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="50" cy="38" r="10" />
      <path d="M 44,28 Q 50,22 53,26" strokeWidth="2" />
      <path d="M 41,48 H 57 L 55,88 H 39 Z" />
      <path d="M 40,50 Q 33,68 40,76" />
      <path d="M 56,50 Q 62,68 58,76" />
      <path d="M 42,88 L 38,122 H 43" />
      <path d="M 51,88 L 54,122 H 59" />
      <line x1="20" y1="130" x2="80" y2="130" stroke="#969696" strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  );
}

// Stage 5: Grown Adult (Formal collar and tuck-in shirt lines)
export function StageAdultSvg({ className = "w-20 h-40 text-slate-900" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 160"
      className={`${className} transition-transform duration-300 hover:scale-105`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="50" cy="35" r="9" />
      <path d="M 45,26 Q 50,20 52,24" strokeWidth="2" />
      <path d="M 46,44 L 50,49 L 54,44" strokeWidth="2" />
      <path d="M 42,44 H 56 L 54,82 H 41 Z" />
      <line x1="41" y1="82" x2="54" y2="82" stroke="currentColor" strokeWidth="3" />
      <path d="M 43,84 L 39,122 H 44" />
      <path d="M 52,84 L 55,122 H 60" />
      <path d="M 56,46 Q 61,64 58,80" strokeWidth="2.5" />
      <line x1="20" y1="130" x2="80" y2="130" stroke="#969696" strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  );
}

// Stage 6: Professional Specialist (Coat/Suit lapels, briefcase/clipboard representation)
export function StageProfessionalSvg({ className = "w-20 h-40 text-slate-900" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 100 160"
      className={`${className} transition-transform duration-300 hover:scale-105`}
      fill="none"
      stroke="currentColor"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="50" cy="32" r="8" />
      <path d="M 45,24 Q 50,19 55,23" strokeWidth="2" />
      <path d="M 42,42 L 50,54 L 58,42" strokeWidth="2" />
      <path d="M 50,54 L 50,82" strokeWidth="1.5" />
      <path d="M 39,42 H 61 L 58,84 H 42 Z" />
      <path d="M 39,44 C 35,56 42,66 50,66 C 58,66 65,56 61,44" />
      <rect x="46" y="52" width="8" height="11" rx="1" fill="currentColor" opacity="0.15" stroke="currentColor" strokeWidth="1.5" />
      <path d="M 43,84 L 40,122 H 45" />
      <path d="M 52,84 L 55,122 H 60" />
      <line x1="20" y1="130" x2="80" y2="130" stroke="#969696" strokeWidth="1" strokeDasharray="3 3" />
    </svg>
  );
}

interface LearnerJourneyFlowProps {
  activeTab: FrictionPoint;
  onTabSelect: (tabId: FrictionPoint) => void;
  tabColorHex: { [key in FrictionPoint]: string };
}

export default function LearnerJourneyFlow({
  activeTab,
  onTabSelect,
  tabColorHex
}: LearnerJourneyFlowProps) {
  const journeyStages = [
    {
      id: 'Visibility' as FrictionPoint,
      title: "Visibility",
      description: "Early mapping & outreach",
      svg: (color: string) => <StageBabySvg className="w-16 h-24 sm:w-20 sm:h-28" />
    },
    {
      id: 'Family Awareness' as FrictionPoint,
      title: "Family Awareness",
      description: "Engaging parents & carers",
      svg: (color: string) => <StageToddlerSvg className="w-16 h-24 sm:w-20 sm:h-28" />
    },
    {
      id: 'Transitions' as FrictionPoint,
      title: "Transitions",
      description: "Curriculum & job alignment",
      svg: (color: string) => <StageSchoolchildSvg className="w-16 h-24 sm:w-20 sm:h-28" />
    },
    {
      id: 'Navigation' as FrictionPoint,
      title: "Navigation",
      description: "Guiding non-linear paths",
      svg: (color: string) => <StageYoungAdultSvg className="w-16 h-24 sm:w-20 sm:h-28" />
    },
    {
      id: 'Translation' as FrictionPoint,
      title: "Translation",
      description: "Matching demand to awareness",
      svg: (color: string) => <StageAdultSvg className="w-16 h-24 sm:w-20 sm:h-28" />
    },
    {
      id: 'Progression' as FrictionPoint,
      title: "Progression",
      description: "Tackling workplace culture",
      svg: (color: string) => <StageProfessionalSvg className="w-16 h-24 sm:w-20 sm:h-28" />
    }
  ];

  const activeIndex = journeyStages.findIndex(s => s.id === activeTab);

  return (
    <div className="w-full bg-white border border-[#e1e1db] rounded-2xl p-6 shadow-xs relative overflow-hidden mb-6">
      {/* Decorative Moving Journey Progress Line (Behind Cards) */}
      <div className="absolute top-[38%] left-12 right-12 h-[2px] bg-[#e1e1db]/60 -z-0 hidden lg:block" />
      
      {/* Fill progress transition indicator */}
      <div 
        className="absolute top-[38%] left-12 h-[2px] bg-[#2E536B] transition-all duration-500 ease-out -z-0 hidden lg:block"
        style={{ 
          width: `${(activeIndex / 5) * (100 - (24 * 100 / 1152))}%`, // Adjust relative to endpoints
          backgroundColor: tabColorHex[activeTab]
        }}
      />

      <div className="flex flex-col gap-4 relative z-10">
        {/* Journey Header with moving status indicator */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-[#e1e1db]/60 pb-4">
          <div>
            <span className="text-[10px] font-bold text-[#2E536B] tracking-wider uppercase">
              The Young Learner's Life Path
            </span>
            <h2 className="text-base font-extrabold text-[#1a2521] tracking-tight">
              A Systemic Collaboration Journey Across Wales
            </h2>
          </div>
          <div className="flex items-center gap-2 bg-[#fbfbf9] px-3 py-1 rounded-xl border border-[#e1e1db] text-xs">
            <span className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: tabColorHex[activeTab] }}></span>
            <span className="text-[#51615a]">Currently Selected: <strong className="text-[#1a2521] font-semibold">Stage {activeIndex + 1}/6</strong></span>
          </div>
        </div>

        {/* 6 Stage Column Layout */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 items-stretch mt-2">
          {journeyStages.map((stage, i) => {
            const isActive = activeTab === stage.id;
            const isCompleted = i <= activeIndex;
            const stageColor = tabColorHex[stage.id];
            
            return (
              <button
                key={stage.id}
                onClick={() => onTabSelect(stage.id)}
                className={`group flex flex-col justify-start text-left rounded-xl p-4 transition-all duration-300 relative overflow-hidden border cursor-pointer ${
                  isActive
                    ? 'bg-white border-[#1a2521] shadow-[0_6px_16px_rgba(26,37,33,0.08)] scale-[1.02] z-10'
                    : 'bg-[#fbfbf9]/40 border-[#e1e1db] hover:border-[#51615a]/40 hover:bg-[#fbfbf9]/80'
                }`}
                style={{
                  borderTop: isActive ? `4px solid ${stageColor}` : '1px solid #e1e1db'
                }}
              >
                {/* Stage Index Badge */}
                <div className="flex items-center justify-between mb-2 w-full">
                  <span 
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                      isActive 
                        ? 'text-white' 
                        : isCompleted 
                          ? 'bg-[#fbfbf9] text-[#51615a]'
                          : 'text-[#969696]/80'
                    }`}
                    style={{
                      backgroundColor: isActive ? stageColor : undefined,
                      borderColor: isActive ? stageColor : '#e1e1db'
                    }}
                  >
                    Stage {i + 1}
                  </span>
                  
                  {isCompleted && !isActive && (
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: stageColor }}></span>
                  )}
                </div>

                {/* Stick Figure Graphic Container */}
                <div 
                  className={`w-full h-28 flex items-center justify-center rounded-lg border mb-3 transition-all duration-300 ${
                    isActive 
                      ? 'bg-white border-transparent' 
                      : 'bg-[#faf9f6]/80 border-[#e1e1db]/40 group-hover:bg-[#faf9f6]'
                  }`}
                  style={{
                    color: isActive ? stageColor : isCompleted ? `${stageColor}b0` : '#969696'
                  }}
                >
                  {stage.svg(stageColor)}
                </div>

                {/* Stage Title and Subtitle */}
                <h4 className={`text-xs font-bold uppercase tracking-wider leading-snug ${
                  isActive ? 'text-[#1a2521]' : 'text-[#51615a] group-hover:text-[#1a2521]'
                }`}>
                  {stage.title}
                </h4>
                <p className="text-[10px] text-[#51615a] mt-1 leading-normal line-clamp-2">
                  {stage.description}
                </p>

                {/* Active Underline indicator on small mobile screens */}
                {isActive && (
                  <div 
                    className="absolute bottom-0 left-0 right-0 h-1"
                    style={{ backgroundColor: stageColor }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
