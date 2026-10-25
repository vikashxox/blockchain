import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  UserPlus,
  Vote,
  CheckCircle,
  Database,
  Shield,
  Lock,
  Key,
  FileCheck,
  Calendar,
  Clock,
  ArrowRight,
  TrendingUp,
  Award,
  Globe2,
  ChevronRight,
  Sparkles,
} from 'lucide-react';
import { useElectionStore } from '../store/electionStore';
import { NeutralEmblem } from '../components/Emblem';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    chainReport,
    phase,
    applications,
    blockchain,
    t,
    loginVoter,
  } = useElectionStore();

  // Compute live statistics from the blockchain and application records
  const registeredCount = applications.filter(a => a.status === 'APPROVED').length;
  const allTxs = blockchain.getAllTransactions();
  const votesCastCount = allTxs.filter(item => item.transaction.type === 'VOTE_CAST').length;
  const totalBlocksCount = blockchain.getChain().length;
  const turnoutPercent = registeredCount > 0 ? Math.min(100, Math.round((votesCastCount / registeredCount) * 100)) : 0;

  // Countdown timer simulation for election phase
  const [timeLeft, setTimeLeft] = useState({ hours: 47, minutes: 18, seconds: 35 });

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev.seconds > 0) return { ...prev, seconds: prev.seconds - 1 };
        if (prev.minutes > 0) return { ...prev, minutes: 59, seconds: 59 };
        if (prev.hours > 0) return { hours: prev.hours - 1, minutes: 59, seconds: 59 };
        return prev;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="space-y-8">
      {/* Official Notice Board Marquee */}
      <div className="bg-white border border-warmBorder rounded-lg p-2.5 shadow-sm flex items-center gap-3 overflow-hidden text-xs">
        <span className="bg-govSaffron text-white font-bold px-2.5 py-1 rounded flex-shrink-0 flex items-center gap-1">
          <TrendingUp className="w-3.5 h-3.5" /> Latest Updates
        </span>
        <div className="marquee-wrapper overflow-hidden whitespace-nowrap text-charcoal font-medium">
          <span className="inline-block animate-marquee">
            📢 General Elections 2026: Overseas NRI Remote E-Voting Pilot active across 10 Parliamentary Constituencies. &bull;
            All ballots secured via ECDSA P-256 and decentralized Proof-of-Authority consensus. &bull;
            Deadline for Form 6A-Sim overseas registration: April 28, 2026. &bull;
            Verify your ballot inclusion at any time using the Public Blockchain Explorer.
          </span>
        </div>
      </div>

      {/* Hero Section */}
      <div className="bg-ivory border border-warmBorder rounded-2xl p-6 sm:p-10 shadow-sm relative overflow-hidden">
        {/* Subtle background decoration */}
        <div className="absolute -right-10 -bottom-10 opacity-5 pointer-events-none">
          <NeutralEmblem size={320} />
        </div>

        <div className="max-w-3xl space-y-4 relative z-10">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cream-200 border border-warmBorder text-xs font-semibold text-govNavy">
            <Globe2 className="w-3.5 h-3.5 text-govSaffron" />
            <span>Empowering 32 Million Non-Resident Indians Worldwide</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-govNavy tracking-tight leading-tight">
            Pravasi Matdan <br />
            <span className="text-govSaffron font-sans text-2xl sm:text-3xl lg:text-4xl font-semibold">
              Cryptographic NRI Remote Voting System
            </span>
          </h2>

          <p className="text-sm sm:text-base text-charcoal-muted leading-relaxed">
            Exercise your sovereign franchise from anywhere in the world. Pravasi Matdan uses client-side WebCrypto encryption, zero-linkage anonymous tokens, and a transparent Proof-of-Authority blockchain ledger to provide coercion-resistant, end-to-end verifiable elections.
          </p>

          {/* Quick Demo Role Switcher Shortcuts */}
          <div className="pt-2 flex flex-wrap items-center gap-3">
            <Link
              to="/register"
              className="px-5 py-2.5 bg-govNavy text-white font-semibold text-sm rounded-lg hover:bg-govNavy-light transition shadow-md flex items-center gap-2"
            >
              <UserPlus className="w-4 h-4 text-govSaffron" />
              <span>Register as NRI Voter</span>
            </Link>

            <button
              onClick={() => {
                loginVoter('NRI-IND-7001');
                navigate('/voter');
              }}
              className="px-5 py-2.5 bg-govGreen text-white font-semibold text-sm rounded-lg hover:bg-govGreen-dark transition shadow-md flex items-center gap-2"
            >
              <Vote className="w-4 h-4" />
              <span>Quick Login as Demo Voter</span>
            </button>

            <Link
              to="/admin"
              className="px-4 py-2.5 bg-cream-100 border border-warmBorder text-govNavy font-semibold text-sm rounded-lg hover:bg-cream-200 transition flex items-center gap-1.5"
            >
              <Shield className="w-4 h-4 text-govNavy" />
              <span>Election Officer Portal</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Live Blockchain Statistics Strip */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-ivory border border-warmBorder rounded-xl p-4 shadow-sm">
          <div className="text-xs text-charcoal-muted font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <UserPlus className="w-3.5 h-3.5 text-blue-600" />
            {t.stats.registeredVoters}
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-govNavy mt-1">
            {registeredCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-emerald-700 font-medium mt-0.5">
            Verified across 25 countries
          </div>
        </div>

        <div className="bg-ivory border border-warmBorder rounded-xl p-4 shadow-sm">
          <div className="text-xs text-charcoal-muted font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Vote className="w-3.5 h-3.5 text-emerald-600" />
            {t.stats.votesCast}
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-govNavy mt-1">
            {votesCastCount.toLocaleString()}
          </div>
          <div className="text-[11px] text-charcoal-muted font-medium mt-0.5">
            Recorded in blockchain blocks
          </div>
        </div>

        <div className="bg-ivory border border-warmBorder rounded-xl p-4 shadow-sm">
          <div className="text-xs text-charcoal-muted font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Database className="w-3.5 h-3.5 text-govSaffron" />
            {t.stats.blocksMined}
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-govNavy mt-1">
            #{totalBlocksCount}
          </div>
          <div className="text-[11px] text-charcoal-muted font-medium mt-0.5">
            3 PoA Validator nodes
          </div>
        </div>

        <div className="bg-ivory border border-warmBorder rounded-xl p-4 shadow-sm">
          <div className="text-xs text-charcoal-muted font-semibold uppercase tracking-wider flex items-center gap-1.5">
            <Award className="w-3.5 h-3.5 text-purple-600" />
            {t.stats.turnout}
          </div>
          <div className="text-2xl sm:text-3xl font-serif font-bold text-govNavy mt-1">
            {turnoutPercent}%
          </div>
          <div className="w-full bg-cream-300 h-1.5 rounded-full mt-2 overflow-hidden">
            <div
              className="bg-govGreen h-full transition-all duration-500"
              style={{ width: `${turnoutPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* 4 Big Action Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Card 1: Register */}
        <Link
          to="/register"
          className="bg-ivory border-2 border-warmBorder hover:border-govSaffron rounded-xl p-5 shadow-sm hover:shadow-md transition group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-lg bg-blue-50 border border-blue-200 text-govNavy flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <UserPlus className="w-6 h-6 text-blue-700" />
            </div>
            <h3 className="font-serif font-bold text-lg text-govNavy group-hover:text-govSaffron transition">
              {t.actions.registerCardTitle}
            </h3>
            <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
              {t.actions.registerCardDesc}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-warmBorder/60 flex items-center text-xs font-semibold text-govNavy group-hover:text-govSaffron">
            <span>Apply Online (Form 6A)</span>
            <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition" />
          </div>
        </Link>

        {/* Card 2: Voter Login */}
        <Link
          to="/voter"
          className="bg-ivory border-2 border-warmBorder hover:border-govGreen rounded-xl p-5 shadow-sm hover:shadow-md transition group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-lg bg-emerald-50 border border-emerald-200 text-govGreen flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Vote className="w-6 h-6 text-emerald-700" />
            </div>
            <h3 className="font-serif font-bold text-lg text-govNavy group-hover:text-govGreen transition">
              {t.actions.voterLoginTitle}
            </h3>
            <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
              {t.actions.voterLoginDesc}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-warmBorder/60 flex items-center text-xs font-semibold text-govNavy group-hover:text-govGreen">
            <span>Enter Voting Booth</span>
            <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition" />
          </div>
        </Link>

        {/* Card 3: Verify My Vote */}
        <Link
          to="/verify"
          className="bg-ivory border-2 border-warmBorder hover:border-govNavy rounded-xl p-5 shadow-sm hover:shadow-md transition group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-lg bg-purple-50 border border-purple-200 text-purple-700 flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <CheckCircle className="w-6 h-6 text-purple-700" />
            </div>
            <h3 className="font-serif font-bold text-lg text-govNavy group-hover:text-govNavy-light transition">
              {t.actions.verifyTitle}
            </h3>
            <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
              {t.actions.verifyDesc}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-warmBorder/60 flex items-center text-xs font-semibold text-govNavy group-hover:text-govNavy-light">
            <span>Audit Your Receipt</span>
            <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition" />
          </div>
        </Link>

        {/* Card 4: Blockchain Explorer */}
        <Link
          to="/explorer"
          className="bg-ivory border-2 border-warmBorder hover:border-govSaffron rounded-xl p-5 shadow-sm hover:shadow-md transition group flex flex-col justify-between"
        >
          <div>
            <div className="w-12 h-12 rounded-lg bg-amber-50 border border-amber-200 text-govSaffron flex items-center justify-center mb-4 group-hover:scale-110 transition">
              <Database className="w-6 h-6 text-govSaffron" />
            </div>
            <h3 className="font-serif font-bold text-lg text-govNavy group-hover:text-govSaffron transition">
              {t.actions.explorerTitle}
            </h3>
            <p className="text-xs text-charcoal-muted mt-2 leading-relaxed">
              {t.actions.explorerDesc}
            </p>
          </div>
          <div className="mt-4 pt-3 border-t border-warmBorder/60 flex items-center text-xs font-semibold text-govNavy group-hover:text-govSaffron">
            <span>Browse Blocks & Txs</span>
            <ChevronRight className="w-4 h-4 ml-auto group-hover:translate-x-1 transition" />
          </div>
        </Link>
      </div>

      {/* Election Notice Board & Phase Countdown */}
      <div className="bg-ivory border border-warmBorder rounded-2xl p-6 shadow-sm grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-3">
          <div className="flex items-center gap-2 text-govNavy font-semibold text-sm">
            <Calendar className="w-4 h-4 text-govSaffron" />
            <span>Pilot Election: General Parliamentary Constituency Elections 2026</span>
          </div>
          <p className="text-xs text-charcoal-muted leading-relaxed">
            Voting is conducted under the simulated Special NRI Franchise Protocol. Qualified overseas electors registered in Varanasi, Thiruvananthapuram, Bangalore South, New Delhi, Amritsar, Hyderabad, and other designated pilot constituencies can cast electronic ballots remotely.
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
            <div className="p-2 rounded bg-cream-100 border border-warmBorder">
              <div className="text-[10px] text-charcoal-muted uppercase">Phase 1</div>
              <div className="font-bold text-govNavy">Voter Enrollment</div>
              <div className="text-[10px] text-emerald-700 font-semibold">COMPLETED</div>
            </div>
            <div className="p-2 rounded bg-cream-100 border border-warmBorder">
              <div className="text-[10px] text-charcoal-muted uppercase">Phase 2</div>
              <div className="font-bold text-govNavy">Remote Voting</div>
              <div className="text-[10px] text-govSaffron font-semibold">ACTIVE NOW</div>
            </div>
            <div className="p-2 rounded bg-cream-100 border border-warmBorder">
              <div className="text-[10px] text-charcoal-muted uppercase">Phase 3</div>
              <div className="font-bold text-govNavy">Key Release & Count</div>
              <div className="text-[10px] text-charcoal-muted font-semibold">SCHEDULED</div>
            </div>
            <div className="p-2 rounded bg-cream-100 border border-warmBorder">
              <div className="text-[10px] text-charcoal-muted uppercase">Phase 4</div>
              <div className="font-bold text-govNavy">Declaration</div>
              <div className="text-[10px] text-charcoal-muted font-semibold">FINAL AUDIT</div>
            </div>
          </div>
        </div>

        {/* Phase Countdown Box */}
        <div className="bg-gradient-to-br from-govNavy to-govNavy-dark text-white rounded-xl p-5 flex flex-col justify-between text-center shadow-inner">
          <div className="space-y-1">
            <div className="text-[11px] text-govSaffron-light uppercase tracking-wider font-semibold flex items-center justify-center gap-1">
              <Clock className="w-3.5 h-3.5" /> Phase Window Closing In
            </div>
            <div className="text-xs text-cream-200">Current Phase: {phase}</div>
          </div>

          <div className="flex items-center justify-center gap-2 my-4">
            <div className="bg-white/10 px-3 py-2 rounded-lg border border-white/20">
              <div className="text-2xl font-mono font-bold text-white">
                {String(timeLeft.hours).padStart(2, '0')}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-cream-300">Hours</div>
            </div>
            <span className="text-xl font-bold text-govSaffron">:</span>
            <div className="bg-white/10 px-3 py-2 rounded-lg border border-white/20">
              <div className="text-2xl font-mono font-bold text-white">
                {String(timeLeft.minutes).padStart(2, '0')}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-cream-300">Mins</div>
            </div>
            <span className="text-xl font-bold text-govSaffron">:</span>
            <div className="bg-white/10 px-3 py-2 rounded-lg border border-white/20">
              <div className="text-2xl font-mono font-bold text-white">
                {String(timeLeft.seconds).padStart(2, '0')}
              </div>
              <div className="text-[9px] uppercase tracking-wider text-cream-300">Secs</div>
            </div>
          </div>

          <Link
            to="/voter"
            className="w-full py-2 bg-govSaffron hover:bg-govSaffron-dark text-white text-xs font-bold rounded-lg transition shadow flex items-center justify-center gap-1.5"
          >
            <span>Proceed to Voting Booth</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>

      {/* 5-Step Infographic */}
      <div className="bg-ivory border border-warmBorder rounded-2xl p-6 sm:p-8 shadow-sm space-y-6">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h3 className="font-serif font-bold text-2xl text-govNavy">
            How Overseas Remote E-Voting Works
          </h3>
          <p className="text-xs text-charcoal-muted">
            Five-stage cryptographic protocol ensuring privacy, anonymity, and end-to-end verifiability.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-cream-100 border border-warmBorder text-center space-y-2 relative">
            <div className="w-10 h-10 mx-auto rounded-full bg-govNavy text-white font-serif font-bold text-sm flex items-center justify-center shadow">
              1
            </div>
            <h4 className="font-serif font-bold text-sm text-govNavy">1. Register</h4>
            <p className="text-[11px] text-charcoal-muted leading-relaxed">
              Submit Indian passport details & constituency online. Only identity hash stored on-chain.
            </p>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-cream-100 border border-warmBorder text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-govNavy text-white font-serif font-bold text-sm flex items-center justify-center shadow">
              2
            </div>
            <h4 className="font-serif font-bold text-sm text-govNavy">2. Verify Identity</h4>
            <p className="text-[11px] text-charcoal-muted leading-relaxed">
              Simulated OTP & biometric liveness check. Election officer approves application.
            </p>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-cream-100 border border-warmBorder text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-govNavy text-white font-serif font-bold text-sm flex items-center justify-center shadow">
              3
            </div>
            <h4 className="font-serif font-bold text-sm text-govNavy">3. Anonymous Token</h4>
            <p className="text-[11px] text-charcoal-muted leading-relaxed">
              Receive one-time blind token unlinked from voter identity to guarantee ballot privacy.
            </p>
          </div>

          {/* Step 4 */}
          <div className="p-4 rounded-xl bg-cream-100 border border-warmBorder text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-govNavy text-white font-serif font-bold text-sm flex items-center justify-center shadow">
              4
            </div>
            <h4 className="font-serif font-bold text-sm text-govNavy">4. Encrypt & Cast</h4>
            <p className="text-[11px] text-charcoal-muted leading-relaxed">
              Ballot encrypted in browser with election public key, signed by voter key, and broadcast.
            </p>
          </div>

          {/* Step 5 */}
          <div className="p-4 rounded-xl bg-cream-100 border border-warmBorder text-center space-y-2">
            <div className="w-10 h-10 mx-auto rounded-full bg-govGreen text-white font-serif font-bold text-sm flex items-center justify-center shadow">
              5
            </div>
            <h4 className="font-serif font-bold text-sm text-govNavy">5. Verifiable Receipt</h4>
            <p className="text-[11px] text-charcoal-muted leading-relaxed">
              Receive on-chain receipt hash to independently verify vote inclusion on public explorer.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
