import React from 'react';

export const NeutralEmblem: React.FC<{ className?: string; size?: number }> = ({ className = '', size = 52 }) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`inline-block ${className}`}
      aria-label="Pravasi Matdan Prototype Neutral Emblem"
    >
      {/* Outer decorative ring */}
      <circle cx="50" cy="50" r="46" stroke="#1B3A6B" strokeWidth="3" fill="#FFFDF9" />
      <circle cx="50" cy="50" r="42" stroke="#E8832A" strokeWidth="1.5" strokeDasharray="3 3" />

      {/* Central stylized Ashoka-inspired civic chakra wheel */}
      <circle cx="50" cy="50" r="28" stroke="#1B3A6B" strokeWidth="2.5" />
      <circle cx="50" cy="50" r="8" fill="#1B3A6B" />

      {/* 16 Radial Spokes */}
      {Array.from({ length: 16 }).map((_, i) => {
        const angle = (i * 360) / 16;
        return (
          <line
            key={i}
            x1="50"
            y1="50"
            x2="50"
            y2="23"
            stroke="#1B3A6B"
            strokeWidth="1.75"
            strokeLinecap="round"
            transform={`rotate(${angle} 50 50)`}
          />
        );
      })}

      {/* 4 Democratic Pillars at Cardinal points */}
      <circle cx="50" cy="11" r="3" fill="#E8832A" />
      <circle cx="50" cy="89" r="3" fill="#2E7D32" />
      <circle cx="11" cy="50" r="3" fill="#1B3A6B" />
      <circle cx="89" cy="50" r="3" fill="#1B3A6B" />
    </svg>
  );
};
