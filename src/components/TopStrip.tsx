import React from 'react';

export const TopStrip: React.FC = () => {
  return (
    <div className="h-1.5 w-full flex" role="presentation" aria-hidden="true">
      <div className="flex-1 bg-[#E8832A]" />
      <div className="flex-1 bg-white" />
      <div className="flex-1 bg-[#2E7D32]" />
    </div>
  );
};
