import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Vote,
  Shield,
  Lock,
  Key,
  CheckCircle,
  AlertTriangle,
  FileCheck,
  Printer,
  Download,
  QrCode as QrIcon,
  Sparkles,
  ArrowRight,
  LogOut,
  RefreshCw,
  Clock,
  ShieldAlert,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import QRCode from 'qrcode';
import { useElectionStore, VoteReceipt } from '../store/electionStore';
import { CONSTITUENCIES, DEMO_VOTERS, Candidate } from '../utils/seedData';

export const VoterBoothPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    currentVoter,
    loginVoter,
    logoutVoter,
    phase,
    castVote,
    latestReceipt,
    t,
  } = useElectionStore();

  // Login Form State
  const [voterIdInput, setVoterIdInput] = useState('NRI-IND-7001');
  const [otpInput, setOtpInput] = useState('123456');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Voting Booth State
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [isNotaSelected, setIsNotaSelected] = useState(false);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [isEncryptingAnimation, setIsEncryptingAnimation] = useState(false);
  const [animationStep, setAnimationStep] = useState(0);
  const [voteReceipt, setVoteReceipt] = useState<VoteReceipt | null>(latestReceipt);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState<string>('');
  const [votingError, setVotingError] = useState<string | null>(null);

  // Active constituency candidates
  const voterConstituency = CONSTITUENCIES.find(
    c => c.id === currentVoter?.constituencyId
  ) || CONSTITUENCIES[0];

  // Generate QR code when receipt is created
  useEffect(() => {
    if (voteReceipt) {
      QRCode.toDataURL(
        `PRAVASI-RECEIPT:${voteReceipt.txHash}:BLK#${voteReceipt.blockIndex}`,
        { width: 160, margin: 1 },
        (err, url) => {
          if (!err && url) setQrCodeDataUrl(url);
        }
      );
    }
  }, [voteReceipt]);

  // Handle Login
  const handleLoginSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError(null);
    const res = loginVoter(voterIdInput, otpInput);
    if (!res.success) {
      setLoginError(res.error || 'Failed to authenticate voter');
    }
  };

  // Handle Private Key File Upload login
  const handleKeyFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In demo mode, read key file or trigger quick login
      loginVoter('NRI-IND-7001');
    }
  };

  // Handle Vote Submission & 4-Step Animation
  const handleConfirmVote = async () => {
    setShowConfirmModal(false);
    setIsEncryptingAnimation(true);
    setVotingError(null);
    setAnimationStep(1); // 1. Encrypting ballot

    await new Promise(r => setTimeout(r, 600));
    setAnimationStep(2); // 2. Signing with ECDSA private key

    await new Promise(r => setTimeout(r, 600));
    setAnimationStep(3); // 3. Broadcasting to validator nodes

    await new Promise(r => setTimeout(r, 600));
    setAnimationStep(4); // 4. Proof-of-Authority Block Mined

    const candidateId = isNotaSelected ? 'NOTA' : selectedCandidate?.id || 'NOTA';
    const result = await castVote(candidateId);

    await new Promise(r => setTimeout(r, 400));
    setIsEncryptingAnimation(false);

    if (result.success && result.receipt) {
      setVoteReceipt(result.receipt);
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
      });
    } else {
      setVotingError(result.error || 'Vote could not be accepted.');
    }
  };

  // If not logged in, render Voter Authentication & Key Upload Screen
  if (!currentVoter) {
    return (
      <div className="max-w-xl mx-auto my-6 space-y-6">
        <div className="bg-ivory border-2 border-warmBorder rounded-2xl p-6 sm:p-8 shadow-md space-y-6">
          <div className="text-center space-y-2">
            <div className="w-14 h-14 bg-emerald-100 text-govGreen rounded-full flex items-center justify-center mx-auto border-2 border-emerald-300">
              <Vote className="w-8 h-8" />
            </div>
            <h2 className="font-serif font-bold text-2xl text-govNavy">
              NRI Voter Authentication & Ballot Access
            </h2>
            <p className="text-xs text-charcoal-muted">
              Access your confidential electronic ballot using your Overseas Voter ID and OTP, or by uploading your cryptographic voter key.
            </p>
          </div>

          {/* Quick Demo Voter Shortcuts */}
          <div className="bg-cream-100 border border-warmBorder p-3.5 rounded-xl space-y-2">
            <span className="text-[11px] font-bold text-govNavy flex items-center gap-1.5 uppercase">
              <Sparkles className="w-3.5 h-3.5 text-govSaffron" /> Quick Demo Voter Shortcuts
            </span>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => {
                  loginVoter('NRI-IND-7001');
                }}
                className="p-2 bg-white border border-warmBorder hover:border-govNavy rounded-lg text-left transition shadow-sm"
              >
                <div className="font-bold text-govNavy">Rohan Narang</div>
                <div className="text-[10px] text-charcoal-muted">Varanasi (UAE) &bull; NRI-IND-7001</div>
              </button>

              <button
                type="button"
                onClick={() => {
                  loginVoter('NRI-IND-7002');
                }}
                className="p-2 bg-white border border-warmBorder hover:border-govNavy rounded-lg text-left transition shadow-sm"
              >
                <div className="font-bold text-govNavy">Dr. Ananya Iyer</div>
                <div className="text-[10px] text-charcoal-muted">Thiruvananthapuram (UK) &bull; 7002</div>
              </button>
            </div>
          </div>

          {loginError && (
            <div className="p-3 bg-rose-50 border border-rose-300 rounded-lg text-xs font-semibold text-rose-900 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{loginError}</span>
            </div>
          )}

          {/* Authentication Form */}
          <form onSubmit={handleLoginSubmit} className="space-y-4 text-xs">
            <div>
              <label className="block font-medium text-charcoal mb-1">
                Overseas Voter ID or Application Reference ID *
              </label>
              <input
                type="text"
                value={voterIdInput}
                onChange={e => setVoterIdInput(e.target.value)}
                placeholder="e.g. NRI-IND-7001 or APP-2026-DXB-7001"
                className="w-full p-2.5 rounded-lg border border-warmBorder bg-white font-mono focus:outline-none focus:ring-2 focus:ring-govNavy"
              />
            </div>

            <div>
              <label className="block font-medium text-charcoal mb-1">
                One-Time Password (OTP) *
              </label>
              <input
                type="text"
                value={otpInput}
                onChange={e => setOtpInput(e.target.value)}
                placeholder="Enter 6-digit OTP"
                className="w-full p-2.5 rounded-lg border border-warmBorder bg-white font-mono focus:outline-none focus:ring-2 focus:ring-govNavy"
              />
              <span className="text-[10px] text-charcoal-muted mt-1 block">
                In demo mode, any 6-digit code or default OTP succeeds.
              </span>
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-govNavy text-white font-bold rounded-lg hover:bg-govNavy-light transition shadow flex items-center justify-center gap-1.5"
            >
              <span>Authenticate & Enter Ballot Booth</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Key File Upload Alternative */}
          <div className="pt-4 border-t border-warmBorder text-center space-y-2">
            <span className="text-[11px] text-charcoal-muted font-medium block">
              — OR Authenticate with Key File —
            </span>
            <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-cream-200 border border-warmBorder text-govNavy rounded-lg text-xs font-semibold hover:bg-cream-300 transition">
              <Key className="w-4 h-4 text-govSaffron" />
              <span>Upload Private Key File (.pem / .json)</span>
              <input type="file" onChange={handleKeyFileUpload} className="hidden" />
            </label>
          </div>
        </div>
      </div>
    );
  }

  // If already voted, display official vote receipt
  if (currentVoter.hasVoted && voteReceipt) {
    return (
      <div className="max-w-2xl mx-auto my-6 space-y-6">
        <div className="bg-ivory border-2 border-emerald-400 rounded-2xl p-6 sm:p-8 shadow-lg text-charcoal space-y-6">
          <div className="text-center space-y-2">
            <div className="w-16 h-16 bg-emerald-100 text-emerald-700 rounded-full flex items-center justify-center mx-auto border-2 border-emerald-300">
              <CheckCircle className="w-10 h-10" />
            </div>
            <span className="text-xs font-bold text-emerald-800 uppercase tracking-widest bg-emerald-50 px-3 py-1 rounded-full border border-emerald-300">
              Vote Recorded & Block Sealed On-Chain
            </span>
            <h2 className="font-serif font-bold text-2xl text-govNavy">
              Official Cryptographic Vote Receipt
            </h2>
            <p className="text-xs text-charcoal-muted max-w-md mx-auto">
              Your secret ballot has been encrypted, signed with your ECDSA key, and confirmed by consensus validator nodes.
            </p>
          </div>

          {/* Printable Official Receipt Slip */}
          <div className="bg-cream-50 border-2 border-dashed border-warmBorder p-5 rounded-xl space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between border-b border-warmBorder pb-2">
              <span className="font-bold text-govNavy font-sans text-sm">
                PRAVASI MATDAN &bull; E-BALLOT RECEIPT
              </span>
              <span className="bg-govGreen text-white text-[10px] px-2 py-0.5 rounded font-sans font-bold">
                CONFIRMED
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-center">
              <div className="sm:col-span-2 space-y-1.5">
                <div>
                  <span className="text-charcoal-muted block text-[10px] uppercase">Transaction Hash</span>
                  <span className="font-bold text-[11px] text-govNavy break-all select-all">
                    {voteReceipt.txHash}
                  </span>
                </div>
                <div>
                  <span className="text-charcoal-muted block text-[10px] uppercase">Block Number</span>
                  <span className="font-bold text-sm text-charcoal">
                    Block #{voteReceipt.blockIndex}
                  </span>
                </div>
                <div>
                  <span className="text-charcoal-muted block text-[10px] uppercase">Constituency</span>
                  <span className="font-bold text-charcoal">{voteReceipt.constituencyName}</span>
                </div>
                <div>
                  <span className="text-charcoal-muted block text-[10px] uppercase">Validator Node</span>
                  <span className="text-[11px] text-charcoal-muted">{voteReceipt.validator}</span>
                </div>
                <div>
                  <span className="text-charcoal-muted block text-[10px] uppercase">Sealed Timestamp</span>
                  <span className="text-[11px]">{new Date(voteReceipt.timestamp).toLocaleString()}</span>
                </div>
              </div>

              {/* QR Code Container */}
              <div className="flex flex-col items-center justify-center p-2 bg-white rounded-lg border border-warmBorder">
                {qrCodeDataUrl ? (
                  <img src={qrCodeDataUrl} alt="Vote Receipt QR" className="w-28 h-28 object-contain" />
                ) : (
                  <QrIcon className="w-20 h-20 text-charcoal-muted" />
                )}
                <span className="text-[9px] text-charcoal-muted mt-1 uppercase font-sans font-semibold">
                  Scan to Verify
                </span>
              </div>
            </div>

            <div className="pt-2 border-t border-warmBorder text-[10px] text-charcoal-muted leading-tight font-sans">
              🔒 <strong>Ballot Secrecy Guarantee:</strong> This receipt proves your vote was included in Block #{voteReceipt.blockIndex}, but reveals zero information about which candidate you selected.
            </div>
          </div>

          {/* Test Double-Voting Button (Acceptance Criteria 3) */}
          <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-xs space-y-1">
            <span className="font-bold text-amber-900 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-amber-700" />
              Demonstrate Double-Voting Rejection (Smart Contract Guard)
            </span>
            <p className="text-[11px] text-amber-800">
              Click below to attempt casting a second vote with the same voter credentials. The smart contract will reject it immediately.
            </p>
            <button
              onClick={async () => {
                const res = await castVote('c-01');
                if (!res.success) {
                  alert(`Smart Contract Rejection Triggered:\n\n${res.error}`);
                }
              }}
              className="mt-1 px-3 py-1 bg-amber-200 hover:bg-amber-300 text-amber-950 font-semibold rounded text-xs transition border border-amber-400"
            >
              Attempt Second Vote (Test Guard)
            </button>
          </div>

          {/* Action buttons */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
            <button
              onClick={() => window.print()}
              className="px-4 py-2 bg-cream-200 border border-warmBorder text-govNavy font-semibold text-xs rounded-lg hover:bg-cream-300 transition flex items-center gap-1.5"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>

            <button
              onClick={() => navigate('/verify')}
              className="px-5 py-2 bg-govNavy text-white font-semibold text-xs rounded-lg hover:bg-govNavy-light transition shadow flex items-center gap-1.5"
            >
              <span>Verify on Public Explorer</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Voting Booth Screen (Ballot)
  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Voter Profile Banner */}
      <div className="bg-ivory border border-warmBorder rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-govNavy font-mono bg-cream-200 px-2 py-0.5 rounded border border-warmBorder">
              {currentVoter.voterId}
            </span>
            <span className="text-xs font-semibold text-charcoal">
              {currentVoter.fullName} ({currentVoter.countryName})
            </span>
          </div>
          <h2 className="font-serif font-bold text-xl text-govNavy mt-1">
            Electronic Ballot: {voterConstituency.name} ({voterConstituency.code})
          </h2>
          <span className="text-xs text-charcoal-muted">
            State: {voterConstituency.state} &bull; Registered Overseas Elector
          </span>
        </div>

        <button
          onClick={logoutVoter}
          className="px-3 py-1.5 border border-warmBorder text-charcoal rounded text-xs font-medium hover:bg-cream-100 transition flex items-center gap-1"
        >
          <LogOut className="w-3.5 h-3.5" /> Sign Out
        </button>
      </div>

      {/* Phase warning if not in VOTING phase */}
      {phase !== 'VOTING' && (
        <div className="p-4 bg-amber-50 border-2 border-amber-300 rounded-xl text-xs space-y-2 text-amber-950">
          <div className="flex items-center gap-2 font-bold text-sm text-amber-900">
            <AlertTriangle className="w-5 h-5 text-amber-700 flex-shrink-0" />
            <span>Voting Booth Inactive — Current Phase: {phase}</span>
          </div>
          <p>
            The electronic ballot can only accept votes when the election is in the <strong>"VOTING"</strong> phase. Use the presenter Demo Guide or switch to the Admin Portal to open the voting phase.
          </p>
        </div>
      )}

      {votingError && (
        <div className="p-3 bg-rose-50 border border-rose-300 rounded-lg text-xs font-semibold text-rose-900 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-rose-600 flex-shrink-0" />
          <span>{votingError}</span>
        </div>
      )}

      {/* Electronic Ballot Paper UI */}
      <div className="bg-ivory border-2 border-govNavy rounded-2xl shadow-md overflow-hidden">
        {/* Ballot Header */}
        <div className="bg-govNavy text-white px-6 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Vote className="w-5 h-5 text-govSaffron" />
            <h3 className="font-serif font-bold text-base tracking-wide">
              Official Electronic Ballot Paper
            </h3>
          </div>
          <span className="text-[11px] font-mono text-cream-200">
            BALLOT-PC-{voterConstituency.code}
          </span>
        </div>

        {/* Candidate Rows */}
        <div className="divide-y divide-warmBorder/70 p-2 sm:p-4 space-y-1">
          {voterConstituency.candidates.map((cand, idx) => {
            const isSelected = selectedCandidate?.id === cand.id && !isNotaSelected;

            return (
              <div
                key={cand.id}
                onClick={() => {
                  if (phase === 'VOTING') {
                    setSelectedCandidate(cand);
                    setIsNotaSelected(false);
                  }
                }}
                className={`p-3.5 rounded-xl border-2 transition flex items-center justify-between gap-4 cursor-pointer ${
                  isSelected
                    ? 'bg-cream-100 border-govSaffron shadow-md ring-2 ring-govSaffron/20'
                    : 'bg-white border-warmBorder/60 hover:bg-cream-50 hover:border-warmBorder'
                } ${phase !== 'VOTING' ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                {/* Serial number & candidate details */}
                <div className="flex items-center gap-3">
                  <span className="w-7 h-7 rounded-full bg-cream-200 text-govNavy font-bold text-xs flex items-center justify-center flex-shrink-0 border border-warmBorder">
                    {idx + 1}
                  </span>
                  <div>
                    <h4 className="font-serif font-bold text-sm sm:text-base text-govNavy">
                      {cand.name}
                    </h4>
                    <div className="text-xs text-charcoal font-medium">
                      {cand.party} ({cand.partyCode})
                    </div>
                    <div className="text-[11px] text-charcoal-muted">
                      Age: {cand.age} &bull; {cand.education}
                    </div>
                  </div>
                </div>

                {/* Party Symbol & Vote Button */}
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl border shadow-inner"
                    style={{ backgroundColor: `${cand.avatarColor}15`, borderColor: `${cand.avatarColor}40` }}
                    title={cand.symbolName}
                  >
                    <span>{cand.symbolEmoji}</span>
                  </div>

                  <button
                    type="button"
                    disabled={phase !== 'VOTING'}
                    onClick={e => {
                      e.stopPropagation();
                      if (phase === 'VOTING') {
                        setSelectedCandidate(cand);
                        setIsNotaSelected(false);
                        setShowConfirmModal(true);
                      }
                    }}
                    className={`px-4 py-2 rounded-lg text-xs font-bold transition shadow ${
                      isSelected
                        ? 'bg-govGreen text-white ring-2 ring-emerald-500'
                        : 'bg-govNavy text-white hover:bg-govNavy-light'
                    }`}
                  >
                    {isSelected ? 'SELECTED' : 'VOTE'}
                  </button>
                </div>
              </div>
            );
          })}

          {/* NOTA (None of the Above) Row */}
          <div
            onClick={() => {
              if (phase === 'VOTING') {
                setIsNotaSelected(true);
                setSelectedCandidate(null);
              }
            }}
            className={`p-3.5 rounded-xl border-2 transition flex items-center justify-between gap-4 cursor-pointer ${
              isNotaSelected
                ? 'bg-cream-100 border-govSaffron shadow-md ring-2 ring-govSaffron/20'
                : 'bg-white border-warmBorder/60 hover:bg-cream-50 hover:border-warmBorder'
            } ${phase !== 'VOTING' ? 'opacity-60 cursor-not-allowed' : ''}`}
          >
            <div className="flex items-center gap-3">
              <span className="w-7 h-7 rounded-full bg-cream-200 text-govNavy font-bold text-xs flex items-center justify-center flex-shrink-0 border border-warmBorder">
                {voterConstituency.candidates.length + 1}
              </span>
              <div>
                <h4 className="font-serif font-bold text-sm sm:text-base text-govNavy">
                  None of the Above (NOTA)
                </h4>
                <div className="text-xs text-charcoal-muted">
                  Constitutional option to reject all candidates in this constituency
                </div>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-gray-100 border border-gray-300 flex items-center justify-center text-lg font-bold text-charcoal">
                🚫
              </div>

              <button
                type="button"
                disabled={phase !== 'VOTING'}
                onClick={e => {
                  e.stopPropagation();
                  if (phase === 'VOTING') {
                    setIsNotaSelected(true);
                    setSelectedCandidate(null);
                    setShowConfirmModal(true);
                  }
                }}
                className={`px-4 py-2 rounded-lg text-xs font-bold transition shadow ${
                  isNotaSelected
                    ? 'bg-govGreen text-white ring-2 ring-emerald-500'
                    : 'bg-charcoal text-white hover:bg-charcoal-muted'
                }`}
              >
                {isNotaSelected ? 'SELECTED' : 'VOTE'}
              </button>
            </div>
          </div>
        </div>

        {/* Ballot Footer */}
        <div className="bg-cream-100 border-t border-warmBorder px-6 py-3 flex items-center justify-between text-xs">
          <span className="text-charcoal-muted font-medium">
            Choice: <strong>{isNotaSelected ? 'None of the Above (NOTA)' : selectedCandidate?.name || 'No candidate selected'}</strong>
          </span>

          <button
            disabled={(!selectedCandidate && !isNotaSelected) || phase !== 'VOTING'}
            onClick={() => setShowConfirmModal(true)}
            className={`px-5 py-2 rounded-lg font-bold text-xs transition shadow flex items-center gap-1.5 ${
              (selectedCandidate || isNotaSelected) && phase === 'VOTING'
                ? 'bg-govGreen text-white hover:bg-govGreen-dark'
                : 'bg-cream-300 text-charcoal-muted cursor-not-allowed'
            }`}
          >
            <span>Proceed to Confirmation</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Confirmation Modal */}
      {showConfirmModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-ivory border-2 border-warmBorder rounded-2xl shadow-2xl max-w-md w-full p-6 space-y-5 text-charcoal animate-fade-in">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 bg-govNavy text-white rounded-full flex items-center justify-center mx-auto shadow">
                <Lock className="w-6 h-6 text-govSaffron" />
              </div>
              <h3 className="font-serif font-bold text-xl text-govNavy">
                Confirm Secret Ballot Choice
              </h3>
              <p className="text-xs text-charcoal-muted">
                Once confirmed, your vote will be sealed and cannot be changed or cast again.
              </p>
            </div>

            <div className="bg-cream-100 border border-warmBorder p-4 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Constituency:</span>
                <span className="font-bold text-charcoal">{voterConstituency.name}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-charcoal-muted">Selected Choice:</span>
                <span className="font-bold text-govNavy text-sm">
                  {isNotaSelected ? 'None of the Above (NOTA)' : selectedCandidate?.name}
                </span>
              </div>
              {!isNotaSelected && selectedCandidate && (
                <div className="flex justify-between">
                  <span className="text-charcoal-muted">Party:</span>
                  <span className="font-medium text-charcoal">
                    {selectedCandidate.party} ({selectedCandidate.symbolEmoji})
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setShowConfirmModal(false)}
                className="flex-1 py-2.5 border border-warmBorder rounded-lg text-xs font-semibold hover:bg-cream-100 transition"
              >
                Change Choice
              </button>
              <button
                onClick={handleConfirmVote}
                className="flex-1 py-2.5 bg-govGreen text-white font-bold rounded-lg hover:bg-govGreen-dark transition shadow text-xs"
              >
                Sign & Cast Ballot
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Simulated Encryption & Signing 4-Step Animation Overlay */}
      {isEncryptingAnimation && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md p-4">
          <div className="bg-ivory border-2 border-govSaffron rounded-2xl shadow-2xl max-w-md w-full p-6 text-charcoal space-y-6 text-center animate-fade-in">
            <div className="w-16 h-16 rounded-full bg-govNavy text-govSaffron flex items-center justify-center mx-auto shadow-lg animate-pulse">
              <Shield className="w-8 h-8" />
            </div>

            <div className="space-y-1">
              <h3 className="font-serif font-bold text-xl text-govNavy">
                Cryptographic Ballot Pipeline
              </h3>
              <p className="text-xs text-charcoal-muted">
                Executing client-side zero-knowledge voting protocol
              </p>
            </div>

            {/* 4 Steps Visualizer */}
            <div className="space-y-3 text-left text-xs">
              <div className={`p-3 rounded-lg border flex items-center gap-3 transition ${animationStep >= 1 ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-white border-warmBorder text-charcoal-muted'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${animationStep >= 1 ? 'bg-emerald-600 text-white' : 'bg-cream-300'}`}>
                  {animationStep > 1 ? '✓' : '1'}
                </div>
                <div>
                  <span className="font-bold block">1. Encrypting Secret Ballot</span>
                  <span className="text-[10px] opacity-80">WebCrypto encryption with Election Master Public Key</span>
                </div>
              </div>

              <div className={`p-3 rounded-lg border flex items-center gap-3 transition ${animationStep >= 2 ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-white border-warmBorder text-charcoal-muted'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${animationStep >= 2 ? 'bg-emerald-600 text-white' : 'bg-cream-300'}`}>
                  {animationStep > 2 ? '✓' : '2'}
                </div>
                <div>
                  <span className="font-bold block">2. Signing with ECDSA P-256 Key</span>
                  <span className="text-[10px] opacity-80">Generating non-repudiable anonymous token signature</span>
                </div>
              </div>

              <div className={`p-3 rounded-lg border flex items-center gap-3 transition ${animationStep >= 3 ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-white border-warmBorder text-charcoal-muted'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${animationStep >= 3 ? 'bg-emerald-600 text-white' : 'bg-cream-300'}`}>
                  {animationStep > 3 ? '✓' : '3'}
                </div>
                <div>
                  <span className="font-bold block">3. Broadcasting to Validator Nodes</span>
                  <span className="text-[10px] opacity-80">Propagating to Delhi, Dubai, and London consensus nodes</span>
                </div>
              </div>

              <div className={`p-3 rounded-lg border flex items-center gap-3 transition ${animationStep >= 4 ? 'bg-emerald-50 border-emerald-300 text-emerald-950' : 'bg-white border-warmBorder text-charcoal-muted'}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${animationStep >= 4 ? 'bg-emerald-600 text-white' : 'bg-cream-300'}`}>
                  {animationStep >= 4 ? '✓' : '4'}
                </div>
                <div>
                  <span className="font-bold block">4. Proof-of-Authority Block Mined</span>
                  <span className="text-[10px] opacity-80">Sealed with Merkle root hash into sovereign ledger</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
