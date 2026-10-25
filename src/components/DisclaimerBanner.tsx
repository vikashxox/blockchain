import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useElectionStore } from '../store/electionStore';

export const DisclaimerBanner: React.FC = () => {
  const { t } = useElectionStore();

  return (
    <div
      role="alert"
      className="bg-amber-100 border-b border-amber-300 text-amber-950 px-4 py-1.5 text-xs sm:text-sm font-medium flex items-center justify-center gap-2 text-center"
    >
      <AlertTriangle className="w-4 h-4 text-amber-700 flex-shrink-0" />
      <span>{t.disclaimerBanner}</span>
    </div>
  );
};
