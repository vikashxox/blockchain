import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, AlertOctagon, CheckCircle2 } from 'lucide-react';
import { NeutralEmblem } from './Emblem';
import { useElectionStore } from '../store/electionStore';

export const Header: React.FC = () => {
  const { chainReport, phase, t } = useElectionStore();

  const phaseColors = {
    REGISTRATION: 'bg-blue-100 text-blue-900 border-blue-300',
    VOTING: 'bg-emerald-100 text-emerald-900 border-emerald-300 ring-2 ring-emerald-500/30',
    COUNTING: 'bg-amber-100 text-amber-900 border-amber-300',
    RESULTS_DECLARED: 'bg-purple-100 text-purple-900 border-purple-300',
  };

  return (
    <header className="bg-ivory border-b border-warmBorder py-3.5 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Brand and Emblem */}
        <Link to="/" className="flex items-center gap-3.5 group">
          <div className="p-1 rounded-full bg-cream-100 border border-warmBorder group-hover:scale-105 transition shadow-sm">
            <NeutralEmblem size={48} />
          </div>
          <div>
            <div className="text-[11px] font-semibold tracking-wider text-charcoal-muted uppercase">
              भारत निर्वाचन ई-सेवा (प्रोटोटाइप) | E-ELECTION PROTOTYPE
            </div>
            <h1 className="text-xl sm:text-2xl font-serif font-bold text-govNavy tracking-tight">
              {t.portalTitle}
            </h1>
            <div className="text-xs text-charcoal-muted font-medium">
              {t.portalSubtitle}
            </div>
          </div>
        </Link>

        {/* Live System Status Badges */}
        <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
          {/* Election Phase Badge */}
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md border text-xs font-semibold shadow-sm bg-white border-warmBorder">
            <span className="text-charcoal-muted font-medium">Phase:</span>
            <span className={`px-2 py-0.5 rounded text-[11px] font-bold border ${phaseColors[phase]}`}>
              {t.phases[phase]}
            </span>
          </div>

          {/* Blockchain Integrity Indicator */}
          <Link
            to="/explorer"
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-xs font-semibold shadow-sm transition ${
              chainReport.isValid
                ? 'bg-emerald-50 border-emerald-300 text-emerald-800 hover:bg-emerald-100'
                : 'bg-rose-100 border-rose-400 text-rose-900 animate-bounce'
            }`}
            title="Click to view Blockchain Explorer"
          >
            {chainReport.isValid ? (
              <>
                <ShieldCheck className="w-4 h-4 text-emerald-600" />
                <span>Ledger Valid ({chainReport.totalBlocks} Blocks)</span>
              </>
            ) : (
              <>
                <AlertOctagon className="w-4 h-4 text-rose-600" />
                <span className="font-bold underline">TAMPER DETECTED (Block #{chainReport.tamperedBlockIndex})</span>
              </>
            )}
          </Link>
        </div>
      </div>
    </header>
  );
};
