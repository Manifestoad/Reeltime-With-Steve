import React from 'react';

const Logo: React.FC = () => {
  return (
    <svg 
      width="80" 
      height="80" 
      viewBox="0 0 100 100" 
      xmlns="http://www.w3.org/2000/svg" 
      className="text-cyan-400"
    >
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3.5" result="coloredBlur" />
          <feMerge>
            <feMergeNode in="coloredBlur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <g style={{ filter: 'url(#glow)' }}>
        {/* Clock circle */}
        <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="4" />
        
        {/* Clock hands */}
        <line x1="50" y1="50" x2="50" y2="25" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        <line x1="50" y1="50" x2="70" y2="50" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
        
        {/* Fish body */}
        <path 
          d="M 25 50 C 35 30, 75 30, 85 50 C 75 70, 35 70, 25 50 Z" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="3.5" 
        />
        
        {/* Fish Tail */}
        <path d="M 15 50 L 25 40 M 15 50 L 25 60" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinecap="round"/>

        {/* Fish Eye */}
        <circle cx="75" cy="50" r="2" fill="currentColor" />
      </g>
    </svg>
  );
};

export default Logo;