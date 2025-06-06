import React from 'react';

export const StartNodeIcon: React.FC<{ color?: string; size?: number; centerFill?: string }> = ({ color = '#6b7280', size = 24, centerFill = '#fff' }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 48 48"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <circle cx="24" cy="24" r="22" fill={color} />
      <polygon points="18,14 36,24 18,34" fill={centerFill} />
    </svg>
  );
}; 