import React from 'react';

export const SpreadsheetNodeIcon: React.FC = () => {
  return (
    <svg width="48" height="48" viewBox="0 0 48 48" fill="none">
      <defs>
        <filter id="node-glow" x="-4" y="-4" width="56" height="56" filterUnits="userSpaceOnUse">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feFlood floodColor="#22c55e" floodOpacity="1" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="glow" />
          <feMerge>
            <feMergeNode in="glow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect x="4" y="4" width="40" height="40" rx="8" fill="#10b981" />
      <rect x="12" y="12" width="8" height="8" rx="2" fill="#fff" />
      <rect x="24" y="12" width="8" height="8" rx="2" fill="#fff" />
      <rect x="36" y="12" width="8" height="8" rx="2" fill="#fff" />
      <rect x="12" y="24" width="8" height="8" rx="2" fill="#fff" />
      <rect x="24" y="24" width="8" height="8" rx="2" fill="#fff" />
      <rect x="36" y="24" width="8" height="8" rx="2" fill="#fff" />
      <rect x="12" y="36" width="8" height="8" rx="2" fill="#fff" />
      <rect x="24" y="36" width="8" height="8" rx="2" fill="#fff" />
      <rect x="36" y="36" width="8" height="8" rx="2" fill="#fff" />
    </svg>
  );
}; 