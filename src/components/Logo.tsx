import React from 'react';

interface LogoProps {
  className?: string;
  size?: string;
}

export const Logo: React.FC<LogoProps> = ({ className = "w-12 h-12", size }) => {
  return (
    <div className={className}>
      <svg viewBox="0 0 300 220" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
        {/* Colored Rectangles based on the user's logo colors */}
        <rect x="15" y="15" width="95" height="90" fill="#29B6BD" rx="2" />
        <rect x="190" y="15" width="95" height="90" fill="#3EB049" rx="2" />
        <rect x="15" y="115" width="95" height="90" fill="#F89E1B" rx="2" />
        <rect x="190" y="115" width="95" height="90" fill="#888E8F" rx="2" />

        {/* Centre Circle 'O' */}
        <circle cx="150" cy="60" r="40" stroke="#000000" strokeWidth="12" fill="none" />

        {/* Geometric 'AHA' letters overlay */}
        {/* Left diagonal leg of left A */}
        <line x1="15" y1="205" x2="110" y2="115" stroke="#000000" strokeWidth="12" strokeLinecap="round" />
        
        {/* Four vertical legs (right of left A, two of H, left of right A) */}
        <line x1="110" y1="115" x2="110" y2="205" stroke="#000000" strokeWidth="12" strokeLinecap="round" />
        <line x1="135" y1="115" x2="135" y2="205" stroke="#000000" strokeWidth="12" strokeLinecap="round" />
        <line x1="165" y1="115" x2="165" y2="205" stroke="#000000" strokeWidth="12" strokeLinecap="round" />
        <line x1="190" y1="115" x2="190" y2="205" stroke="#000000" strokeWidth="12" strokeLinecap="round" />

        {/* Right diagonal leg of right A */}
        <line x1="190" y1="115" x2="285" y2="205" stroke="#000000" strokeWidth="12" strokeLinecap="round" />

        {/* Continuous horizontal crossbar through all three letterforms */}
        <line x1="15" y1="175" x2="285" y2="175" stroke="#000000" strokeWidth="12" strokeLinecap="round" />
      </svg>
    </div>
  );
};
