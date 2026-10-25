import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  ChevronDown,
  ChevronUp,
  CheckCircle,
  Play,
  RotateCcw,
  Users,
  ShieldAlert,
  ShieldCheck,
  FastForward,
  Vote,
  Sparkles,
} from 'lucide-react';
import { useElectionStore } from '../store/electionStore';

export const DemoGuide: React.FC<{ onAutoFillRegister?: () => void }> = ({ onAutoFillRegister }) => {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const {
    phase,
    setElectionPhase,
    chainReport,
    runTamperTest,
    restoreChain,
    seedDemoVoters,
    resetDemoData,
    applications,
    approveApplication,
    loginVoter,
    latestReceipt,
  } = useElectionStore();

  const [activeStep, setActiveStep] = useState(1);

  // Check progress
  const approvedVotersCount = applications.filter(a => a.status === 'APPROVED').length;
  const pendingVotersCount = applications.filter(a => a.status === 'PENDING').length;
  const votedCount = applications.filter(a => a.hasVoted).length;

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm sm:max-w-md w-full px-2 sm:px-0">
      <div className="bg-ivory border-2 border-govSaffron shadow-2xl rounded-xl overflow-hidden text-charcoal">
        {/* Header Banner */}
        <div
          onClick={() => setIsOpen(!isOpen)}
          className="bg-gradient-to-r from-govNavy to-govNavy-light text-white px-3.5 py-2.5 flex items-center justify-between cursor-pointer select-none"
        >
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-govSaffron animate-spin-slow" />
            <div>
              <span className="font-serif font-bold text-sm tracking-wide">
                Presenter Demo Guide
              </span>
              <span className="hidden sm:inline-block ml-2 text-[10px] bg-govSaffron/80 text-white px-1.5 py-0.2 rounded font-semibold uppercase">
                Showcase Mode
              </span>
            </div>
          </div>
          <button
            className="p-1 hover:bg-white/20 rounded transition"
            aria-label={isOpen ? 'Collapse Demo Guide' : 'Expand Demo Guide'}
          >
            {isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
        </div>

        {/* Body content */}
        {isOpen && (
          <div className="p-3.5 space-y-3 max-h-[75vh] overflow-y-auto text-xs">
            <p className="text-[11px] text-charcoal-muted leading-relaxed">
              Follow this step-by-step showcase flow to demonstrate the end-to-end cryptographic NRI voting lifecycle.
            </p>

            {/* Checklist Steps */}
            <div className="space-y-2 border-t border-b border-warmBorder py-2">
              {/* Step 1 */}
              <div
                className={`p-2 rounded border transition ${
                  activeStep === 1 ? 'bg-cream-100 border-govSaffron shadow-sm' : 'bg-white border-warmBorder/60'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="flex items-start gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-govNavy text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                      1
                    </span>
                    <div>
                      <div className="font-semibold text-govNavy">1. Register NRI Voter</div>
                      <div className="text-[11px] text-charcoal-muted">
                        Submit passport, country biometrics & get Ref ID
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveStep(1);
                      navigate('/register');
                      if (onAutoFillRegister) onAutoFillRegister();
                    }}
                    className="px-2 py-1 bg-govSaffron text-white rounded font-medium hover:bg-govSaffron-dark transition flex items-center gap-1 shadow-sm"
                  >
                    <Play className="w-3 h-3" /> Go to Form
                  </button>
                </div>
              </div>

              {/* Step 2 */}
              <div
                className={`p-2 rounded border transition ${
                  activeStep === 2 ? 'bg-cream-100 border-govSaffron shadow-sm' : 'bg-white border-warmBorder/60'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="flex items-start gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-govNavy text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                      2
                    </span>
                    <div>
                      <div className="font-semibold text-govNavy">2. Admin Approval & Key Issuance</div>
                      <div className="text-[11px] text-charcoal-muted">
                        Officer verifies docs & mints ECDSA P-256 keys on-chain
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveStep(2);
                      navigate('/admin');
                    }}
                    className="px-2 py-1 bg-govNavy text-white rounded font-medium hover:bg-govNavy-light transition flex items-center gap-1 shadow-sm"
                  >
                    Admin Portal
                  </button>
                </div>
              </div>

              {/* Step 3 */}
              <div
                className={`p-2 rounded border transition ${
                  activeStep === 3 ? 'bg-cream-100 border-govSaffron shadow-sm' : 'bg-white border-warmBorder/60'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="flex items-start gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-govNavy text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                      3
                    </span>
                    <div>
                      <div className="font-semibold text-govNavy">3. Open Live Voting Phase</div>
                      <div className="text-[11px] text-charcoal-muted">
                        Current Phase: <strong className="text-govSaffron font-bold">{phase}</strong>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      setActiveStep(3);
                      await setElectionPhase('VOTING');
                    }}
                    className={`px-2 py-1 rounded font-medium transition flex items-center gap-1 ${
                      phase === 'VOTING' ? 'bg-emerald-600 text-white' : 'bg-govSaffron text-white hover:bg-govSaffron-dark'
                    }`}
                  >
                    <FastForward className="w-3 h-3" /> Set VOTING
                  </button>
                </div>
              </div>

              {/* Step 4 */}
              <div
                className={`p-2 rounded border transition ${
                  activeStep === 4 ? 'bg-cream-100 border-govSaffron shadow-sm' : 'bg-white border-warmBorder/60'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="flex items-start gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-govNavy text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                      4
                    </span>
                    <div>
                      <div className="font-semibold text-govNavy">4. Electronic Ballot & Casting</div>
                      <div className="text-[11px] text-charcoal-muted">
                        Encrypt ballot & test double-voting rejection
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveStep(4);
                      loginVoter('NRI-IND-7001');
                      navigate('/voter');
                    }}
                    className="px-2 py-1 bg-govGreen text-white rounded font-medium hover:bg-govGreen-dark transition flex items-center gap-1 shadow-sm"
                  >
                    <Vote className="w-3 h-3" /> Login Voter
                  </button>
                </div>
              </div>

              {/* Step 5 */}
              <div
                className={`p-2 rounded border transition ${
                  activeStep === 5 ? 'bg-cream-100 border-govSaffron shadow-sm' : 'bg-white border-warmBorder/60'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="flex items-start gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-govNavy text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                      5
                    </span>
                    <div>
                      <div className="font-semibold text-govNavy">5. Public Vote Verification</div>
                      <div className="text-[11px] text-charcoal-muted">
                        Zero-knowledge receipt verification on-chain
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveStep(5);
                      navigate('/verify');
                    }}
                    className="px-2 py-1 bg-govNavy text-white rounded font-medium hover:bg-govNavy-light transition flex items-center gap-1 shadow-sm"
                  >
                    Verify Page
                  </button>
                </div>
              </div>

              {/* Step 6 */}
              <div
                className={`p-2 rounded border transition ${
                  activeStep === 6 ? 'bg-cream-100 border-govSaffron shadow-sm' : 'bg-white border-warmBorder/60'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="flex items-start gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-govNavy text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                      6
                    </span>
                    <div>
                      <div className="font-semibold text-govNavy">6. Blockchain Tamper Showcase</div>
                      <div className="text-[11px] text-charcoal-muted">
                        Simulate database hack; watch chain break red!
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    {chainReport.isValid ? (
                      <button
                        onClick={async () => {
                          setActiveStep(6);
                          await runTamperTest(1);
                          navigate('/explorer');
                        }}
                        className="px-2 py-1 bg-rose-600 text-white rounded font-medium hover:bg-rose-700 transition flex items-center gap-1 shadow-sm"
                      >
                        <ShieldAlert className="w-3 h-3" /> Tamper
                      </button>
                    ) : (
                      <button
                        onClick={async () => {
                          await restoreChain();
                        }}
                        className="px-2 py-1 bg-emerald-600 text-white rounded font-medium hover:bg-emerald-700 transition flex items-center gap-1 shadow-sm"
                      >
                        <ShieldCheck className="w-3 h-3" /> Restore
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Step 7 */}
              <div
                className={`p-2 rounded border transition ${
                  activeStep === 7 ? 'bg-cream-100 border-govSaffron shadow-sm' : 'bg-white border-warmBorder/60'
                }`}
              >
                <div className="flex items-start justify-between gap-1">
                  <div className="flex items-start gap-1.5">
                    <span className="w-4 h-4 rounded-full bg-govNavy text-white flex items-center justify-center font-bold text-[10px] flex-shrink-0 mt-0.5">
                      7
                    </span>
                    <div>
                      <div className="font-semibold text-govNavy">7. Key Release & Results</div>
                      <div className="text-[11px] text-charcoal-muted">
                        Decrypt secret ballots & compute tallies
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={async () => {
                      setActiveStep(7);
                      await setElectionPhase('RESULTS_DECLARED');
                      navigate('/results');
                    }}
                    className="px-2 py-1 bg-purple-700 text-white rounded font-medium hover:bg-purple-800 transition flex items-center gap-1 shadow-sm"
                  >
                    View Results
                  </button>
                </div>
              </div>
            </div>

            {/* Quick Helper Actions */}
            <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
              <button
                onClick={async () => {
                  await seedDemoVoters();
                }}
                className="px-2.5 py-1 rounded bg-cream-200 border border-warmBorder hover:bg-cream-300 font-medium text-govNavy transition flex items-center gap-1 text-[11px]"
              >
                <Users className="w-3.5 h-3.5 text-govNavy" />
                <span>Seed 20 Voters</span>
              </button>

              <button
                onClick={async () => {
                  if (confirm('Reset all demo state to fresh ledger?')) {
                    await resetDemoData();
                  }
                }}
                className="px-2.5 py-1 rounded bg-rose-50 border border-rose-300 text-rose-800 hover:bg-rose-100 font-medium transition flex items-center gap-1 text-[11px]"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Demo</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
