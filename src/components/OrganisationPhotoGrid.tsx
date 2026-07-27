import React, { useState } from 'react';
import { MapPin } from 'lucide-react';

interface PhotoItem {
  id: string;
  filename: string;
  title: string;
  location: string;
  spanClass: string;
  bgGradient: string;
}

const OD_PHOTOS: PhotoItem[] = [
  {
    id: 'OD-1',
    filename: 'OD-1.jpg',
    title: 'North Wales Regional Innovation Hub',
    location: 'Bangor & Conwy Valley',
    spanClass: 'col-span-1 sm:col-span-2 md:col-span-2 md:row-span-2 min-h-[200px]',
    bgGradient: 'from-teal-600 via-teal-700 to-emerald-800',
  },
  {
    id: 'OD-2',
    filename: 'OD-2.jpg',
    title: 'Community Apprenticeship Workshop',
    location: 'Rhondda Cynon Taf',
    spanClass: 'col-span-1 sm:col-span-1 md:col-span-1 md:row-span-1 min-h-[160px]',
    bgGradient: 'from-emerald-600 via-teal-700 to-cyan-800',
  },
  {
    id: 'OD-3',
    filename: 'OD-3.jpg',
    title: 'Bilingual Youth STEM Lab',
    location: 'Aberystwyth & Ceredigion',
    spanClass: 'col-span-1 sm:col-span-1 md:col-span-1 md:row-span-2 min-h-[200px]',
    bgGradient: 'from-cyan-600 via-teal-700 to-emerald-700',
  },
  {
    id: 'OD-4',
    filename: 'OD-4.jpg',
    title: 'Green Economy Career Discovery',
    location: 'Swansea Bay & Neath Port Talbot',
    spanClass: 'col-span-1 sm:col-span-1 md:col-span-1 md:row-span-1 min-h-[160px]',
    bgGradient: 'from-teal-700 via-emerald-600 to-cyan-700',
  },
  {
    id: 'OD-5',
    filename: 'OD-5.jpg',
    title: 'Regional Sector Employer Round Table',
    location: 'Cardiff Capital Region',
    spanClass: 'col-span-1 sm:col-span-2 md:col-span-2 md:row-span-1 min-h-[160px]',
    bgGradient: 'from-emerald-700 via-teal-600 to-slate-700',
  },
  {
    id: 'OD-6',
    filename: 'OD-6.jpg',
    title: 'Foundational Economy Learning Circle',
    location: 'Pembrokeshire Coast',
    spanClass: 'col-span-1 sm:col-span-1 md:col-span-1 md:row-span-1 min-h-[160px]',
    bgGradient: 'from-cyan-700 via-teal-800 to-emerald-600',
  },
  {
    id: 'OD-7',
    filename: 'OD-7.jpg',
    title: 'Social Enterprise & Youth Skills Forum',
    location: 'Wrexham & Flintshire',
    spanClass: 'col-span-1 sm:col-span-1 md:col-span-1 md:row-span-1 min-h-[160px]',
    bgGradient: 'from-teal-600 via-emerald-700 to-cyan-800',
  },
];

export const OrganisationPhotoGrid: React.FC = () => {
  // Track images that failed to load so we render a stylized placeholder box
  const [failedImages, setFailedImages] = useState<Record<string, boolean>>({});

  const handleImageError = (id: string) => {
    setFailedImages((prev) => ({ ...prev, [id]: true }));
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-5 auto-rows-[170px] text-left">
      {OD_PHOTOS.map((photo) => {
          const hasFailed = failedImages[photo.id];

          return (
            <div
              key={photo.id}
              className={`relative group rounded-2xl overflow-hidden border border-[#e1e1db] shadow-2xs transition-all duration-300 hover:shadow-md ${photo.spanClass}`}
            >
              {!hasFailed ? (
                <img
                  src={`/${photo.filename}`}
                  alt={photo.title}
                  referrerPolicy="no-referrer"
                  onError={() => handleImageError(photo.id)}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
              ) : null}

              {/* Fallback frame if image is not uploaded on server yet */}
              {hasFailed && (
                <div className={`w-full h-full bg-gradient-to-br ${photo.bgGradient} p-4 flex flex-col justify-end text-white relative overflow-hidden`}>
                  {/* Background decoration */}
                  <div className="absolute -right-6 -top-6 w-24 h-24 rounded-full bg-white/10 pointer-events-none" />
                  
                  <div className="z-10 space-y-1 bg-black/20 backdrop-blur-xs p-2.5 rounded-xl border border-white/10">
                    <h4 className="text-xs font-semibold leading-tight text-white/80 group-hover:text-white transition">
                      {photo.title}
                    </h4>
                    <div className="flex items-center gap-1 text-[10px] text-white/60">
                      <MapPin className="w-3 h-3 flex-shrink-0 text-teal-300" />
                      <span className="truncate">{photo.location}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Overlay caption bar when image is loaded - soft and transparent */}
              {!hasFailed && (
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent p-3.5 flex flex-col justify-end text-white opacity-85 group-hover:opacity-100 transition duration-300">
                  <div className="space-y-0.5 bg-black/20 backdrop-blur-xs p-2 rounded-xl border border-white/10">
                    <h4 className="text-xs font-semibold text-white/85 group-hover:text-white transition drop-shadow-xs">{photo.title}</h4>
                    <p className="text-[10px] text-white/65 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-[#29B6BD]" />
                      {photo.location}
                    </p>
                  </div>
                </div>
              )}
            </div>
          );
        })}
    </div>
  );
};
