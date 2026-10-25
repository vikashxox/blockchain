import React, { useState } from 'react';
import {
  ShieldAlert,
  ShieldCheck,
  CheckCircle,
  XCircle,
  Users,
  Vote,
  Database,
  Lock,
  FastForward,
  RotateCcw,
  AlertTriangle,
  FileText,
  Clock,
  Sparkles,
  ChevronRight,
  UserCheck,
} from 'lucide-react';
import { useElectionStore, VoterApplication } from '../store/electionStore';
import { ElectionPhase } from '../contracts/votingContract';
import { CONSTITUENCIES } from '../utils/seedData';

export const AdminPage: React.FC = () => {
  const {
    isAdmin,
    loginAsAdmin,
    logoutAdmin,
    applications,
    approveApplication,
    rejectApplication,
    phase,
    setElectionPhase,
    blockchain,
    chainReport,
    seedDemoVoters,
    resetDemoData,
    runTamperTest,
    restoreChain,
  } = useElectionStore();

  const [passwordInput, setPasswordInput] = useState('admin123');
  const [selectedApp, setSelectedApp] = useState<VoterApplication | null>(null);
  const [rejectionRemark, setRejectionRemark] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [actionNotice, setActionNotice] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'applications' | 'phases' | 'candidates' | 'audit'>('applications');

  // Stats
  const pendingApps = applications.filter(a => a.status === 'PENDING' || a.status === 'UNDER_REVIEW');
  const approvedApps = applications.filter(a => a.status === 'APPROVED');
  const rejectedApps = applications.filter(a => a.status === 'REJECTED');
  const allTxs = blockchain.getAllTransactions();
  const votesCount = allTxs.filter(t => t.transaction.type === 'VOTE_CAST').length;
  const auditLogs = allTxs.filter(t => t.transaction.type === 'ADMIN_AUDIT' || t.transaction.type === 'PHASE_CHANGED');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!loginAsAdmin(passwordInput)) {
      alert('Incorrect password. Use: admin123');
    }
  };

  const handleApprove = async (appId: string) => {
    setIsProcessing(true);
    await approveApplication(appId);
    setIsProcessing(false);
    setSelectedApp(null);
    setActionNotice(`Application ${appId} Approved! WebCrypto ECDSA keypair minted and enrolled into the ledger.`);
    setTimeout(() => setActionNotice(null), 5000);
  };

  const handleReject = async (appId: string) => {
    if (!rejectionRemark.trim()) {
      alert('Please specify a reason for rejection.');
      return;
    }
    setIsProcessing(true);
    await rejectApplication(appId, rejectionRemark);
    setIsProcessing(false);
    setSelectedApp(null);
    setRejectionRemark('');
    setActionNotice(`Application ${appId} Rejected. Reason recorded on-chain.`);
    setTimeout(() => setActionNotice(null), 5000);
  };

  if (!isAdmin) {
    return (
      <div className="max-w-md mx-auto my-12 bg-ivory border-2 border-warmBorder rounded-2xl p-6 sm:p-8 shadow-md">
        <div className="text-center space-y-2 mb-6">
          <div className="w-14 h-14 bg-govNavy text-white rounded-full flex items-center justify-center mx-auto shadow">
            <Lock className="w-7 h-7 text-govSaffron" />
          </div>
          <h2 className="font-serif font-bold text-2xl text-govNavy">
            Election Officer Authentication
          </h2>
          <p className="text-xs text-charcoal-muted">
            Restricted administrative portal for Returning Officers (RO) and Chief Electoral Officers.
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4 text-xs">
          <div>
            <label className="block font-medium text-charcoal mb-1">Officer Username</label>
            <input
              type="text"
              readOnly
              value="admin"
              className="w-full p-2.5 rounded-lg border border-warmBorder bg-cream-100 font-mono text-charcoal"
            />
          </div>

          <div>
            <label className="block font-medium text-charcoal mb-1">Passphrase</label>
            <input
              type="password"
              value={passwordInput}
              onChange={e => setPasswordInput(e.target.value)}
              placeholder="Enter passphrase"
              className="w-full p-2.5 rounded-lg border border-warmBorder bg-white focus:outline-none focus:ring-2 focus:ring-govNavy font-mono"
            />
            <span className="text-[10px] text-charcoal-muted mt-1 block">
              Default demo credential: <strong className="font-mono text-govNavy">admin123</strong>
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 bg-govNavy text-white font-bold rounded-lg hover:bg-govNavy-light transition shadow flex items-center justify-center gap-1.5"
          >
            <span>Authenticate Secure Session</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Officer Bar */}
      <div className="bg-ivory border border-warmBorder rounded-xl p-4 shadow-sm flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-govNavy text-white font-mono text-[10px] font-bold">
              OFFICER-HQ-DELHI
            </span>
            <span className="text-xs font-semibold text-charcoal">
              Returning Officer: Parliamentary Overseas Franchise
            </span>
          </div>
          <h2 className="font-serif font-bold text-xl text-govNavy mt-1">
            Election Officer Control Center
          </h2>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-auto">
          <button
            onClick={logoutAdmin}
            className="px-3 py-1.5 border border-warmBorder text-charcoal rounded text-xs font-medium hover:bg-cream-100 transition"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Action Notice Alert */}
      {actionNotice && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs font-semibold text-emerald-900 flex items-center gap-2 animate-fade-in">
          <CheckCircle className="w-4 h-4 text-emerald-600 flex-shrink-0" />
          <span>{actionNotice}</span>
        </div>
      )}

      {/* Dashboard Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="bg-ivory border border-warmBorder p-3 rounded-xl shadow-sm">
          <div className="text-[11px] text-charcoal-muted font-medium">Pending Review</div>
          <div className="text-2xl font-serif font-bold text-amber-700 mt-0.5">
            {pendingApps.length}
          </div>
          <div className="text-[10px] text-charcoal-muted">Form 6A submissions</div>
        </div>

        <div className="bg-ivory border border-warmBorder p-3 rounded-xl shadow-sm">
          <div className="text-[11px] text-charcoal-muted font-medium">Approved Voters</div>
          <div className="text-2xl font-serif font-bold text-emerald-700 mt-0.5">
            {approvedApps.length}
          </div>
          <div className="text-[10px] text-charcoal-muted">Keys generated on-chain</div>
        </div>

        <div className="bg-ivory border border-warmBorder p-3 rounded-xl shadow-sm">
          <div className="text-[11px] text-charcoal-muted font-medium">Rejected</div>
          <div className="text-2xl font-serif font-bold text-rose-700 mt-0.5">
            {rejectedApps.length}
          </div>
          <div className="text-[10px] text-charcoal-muted">Disqualified submissions</div>
        </div>

        <div className="bg-ivory border border-warmBorder p-3 rounded-xl shadow-sm">
          <div className="text-[11px] text-charcoal-muted font-medium">Votes Cast On-Chain</div>
          <div className="text-2xl font-serif font-bold text-govNavy mt-0.5">
            {votesCount}
          </div>
          <div className="text-[10px] text-charcoal-muted">Secret encrypted ballots</div>
        </div>

        <div className="bg-ivory border border-warmBorder p-3 rounded-xl shadow-sm col-span-2 md:col-span-1">
          <div className="text-[11px] text-charcoal-muted font-medium">Ledger Health</div>
          <div className={`text-sm font-bold mt-1 flex items-center gap-1 ${chainReport.isValid ? 'text-emerald-700' : 'text-rose-700'}`}>
            {chainReport.isValid ? <ShieldCheck className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
            <span>{chainReport.isValid ? 'All Blocks Valid' : 'TAMPER DETECTED'}</span>
          </div>
          <div className="text-[10px] text-charcoal-muted">#{chainReport.totalBlocks} Blocks mined</div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="border-b border-warmBorder flex gap-2 text-xs font-semibold overflow-x-auto">
        {[
          { id: 'applications', label: `Voter Applications (${applications.length})` },
          { id: 'phases', label: `Election Phase Control (${phase})` },
          { id: 'candidates', label: 'Candidates & Constituencies' },
          { id: 'audit', label: `On-Chain Audit Log (${auditLogs.length})` },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
            className={`px-4 py-2 border-b-2 whitespace-nowrap transition ${
              activeTab === tab.id
                ? 'border-govSaffron text-govNavy font-bold bg-white/60'
                : 'border-transparent text-charcoal-muted hover:text-charcoal'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* TAB 1: Applications Review Screen */}
      {activeTab === 'applications' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Applications Table */}
          <div className="lg:col-span-2 bg-ivory border border-warmBorder rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 bg-cream-100 border-b border-warmBorder flex items-center justify-between">
              <h3 className="font-serif font-bold text-sm text-govNavy">
                Overseas Voter Applications Queue
              </h3>
              <button
                onClick={async () => {
                  await seedDemoVoters();
                  setActionNotice('20 demo NRI voters seeded & registered on-chain!');
                  setTimeout(() => setActionNotice(null), 4000);
                }}
                className="px-2.5 py-1 bg-govNavy text-white rounded text-xs font-medium hover:bg-govNavy-light transition flex items-center gap-1"
              >
                <Users className="w-3.5 h-3.5" />
                <span>Seed 20 Demo Voters</span>
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-cream-200 text-charcoal-muted font-semibold uppercase text-[10px] border-b border-warmBorder">
                  <tr>
                    <th className="p-3">Ref ID</th>
                    <th className="p-3">Applicant Name</th>
                    <th className="p-3">Country</th>
                    <th className="p-3">Constituency</th>
                    <th className="p-3">Status</th>
                    <th className="p-3">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-warmBorder/60">
                  {applications.map((app, idx) => {
                    const statusBadgeClass = {
                      PENDING: 'bg-amber-100 text-amber-900 border-amber-300',
                      UNDER_REVIEW: 'bg-blue-100 text-blue-900 border-blue-300',
                      APPROVED: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                      REJECTED: 'bg-rose-100 text-rose-900 border-rose-300',
                    }[app.status];

                    return (
                      <tr
                        key={app.id}
                        className={`transition ${idx % 2 === 0 ? 'bg-white' : 'bg-cream-50/50'} hover:bg-cream-100/60`}
                      >
                        <td className="p-3 font-mono font-bold text-govNavy">{app.id}</td>
                        <td className="p-3 font-medium text-charcoal">{app.fullName}</td>
                        <td className="p-3">{app.countryName}</td>
                        <td className="p-3">{app.constituencyName}</td>
                        <td className="p-3">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${statusBadgeClass}`}>
                            {app.status}
                          </span>
                        </td>
                        <td className="p-3">
                          <button
                            onClick={() => setSelectedApp(app)}
                            className="px-2.5 py-1 bg-govNavy text-white rounded text-[11px] font-medium hover:bg-govNavy-light transition"
                          >
                            Review
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>

          {/* Application Detail & Approval Panel */}
          <div className="bg-ivory border border-warmBorder rounded-xl p-5 shadow-sm space-y-4">
            {selectedApp ? (
              <div className="space-y-4 text-xs">
                <div className="flex items-center justify-between border-b border-warmBorder pb-2">
                  <h4 className="font-serif font-bold text-sm text-govNavy">
                    Review Application: {selectedApp.id}
                  </h4>
                  <button
                    onClick={() => setSelectedApp(null)}
                    className="text-charcoal-muted hover:text-charcoal text-xs"
                  >
                    Close
                  </button>
                </div>

                <div className="space-y-2">
                  <div>
                    <span className="text-charcoal-muted block text-[10px] uppercase">Applicant</span>
                    <strong className="text-sm text-charcoal">{selectedApp.fullName}</strong> ({selectedApp.gender}, DOB: {selectedApp.dob})
                  </div>
                  <div>
                    <span className="text-charcoal-muted block text-[10px] uppercase">Passport & Country</span>
                    <span className="font-mono font-bold">{selectedApp.passportNumber}</span> — {selectedApp.countryName}
                  </div>
                  <div>
                    <span className="text-charcoal-muted block text-[10px] uppercase">Home Constituency</span>
                    <span className="font-bold text-govNavy">{selectedApp.constituencyName}</span>
                  </div>
                  <div>
                    <span className="text-charcoal-muted block text-[10px] uppercase">Contact</span>
                    <span>{selectedApp.email} | {selectedApp.mobile}</span>
                  </div>
                </div>

                {/* Document Previews */}
                <div className="space-y-2 pt-2 border-t border-warmBorder">
                  <span className="text-[10px] font-bold text-charcoal-muted uppercase">Attached Documents</span>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="border border-warmBorder rounded p-2 bg-white text-center">
                      <span className="text-[10px] block font-semibold text-charcoal mb-1">Passport Scan</span>
                      <img
                        src={selectedApp.passportDocBase64}
                        alt="Passport Preview"
                        className="h-16 mx-auto object-contain rounded"
                      />
                    </div>
                    <div className="border border-warmBorder rounded p-2 bg-white text-center">
                      <span className="text-[10px] block font-semibold text-charcoal mb-1">Photo Preview</span>
                      <img
                        src={selectedApp.photoDocBase64}
                        alt="Photo Preview"
                        className="h-16 mx-auto object-contain rounded"
                      />
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                {selectedApp.status !== 'APPROVED' ? (
                  <div className="space-y-2 pt-2 border-t border-warmBorder">
                    <button
                      onClick={() => handleApprove(selectedApp.id)}
                      disabled={isProcessing}
                      className="w-full py-2 bg-govGreen text-white font-bold rounded-lg hover:bg-govGreen-dark transition flex items-center justify-center gap-1.5 shadow"
                    >
                      <UserCheck className="w-4 h-4" />
                      <span>Approve & Generate On-Chain Keys</span>
                    </button>

                    <div className="space-y-1 pt-2">
                      <label className="block text-[11px] font-medium text-charcoal">Rejection Reason</label>
                      <input
                        type="text"
                        value={rejectionRemark}
                        onChange={e => setRejectionRemark(e.target.value)}
                        placeholder="e.g. Passport image blurred; expiry date invalid"
                        className="w-full p-2 border border-warmBorder rounded bg-white"
                      />
                      <button
                        onClick={() => handleReject(selectedApp.id)}
                        disabled={isProcessing}
                        className="w-full py-1.5 bg-rose-100 border border-rose-300 text-rose-800 font-semibold rounded hover:bg-rose-200 transition text-[11px]"
                      >
                        Reject Application
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 space-y-1">
                    <span className="font-bold flex items-center gap-1 text-xs">
                      <CheckCircle className="w-4 h-4 text-emerald-600" /> Voter Already Approved
                    </span>
                    <div className="text-[11px]">
                      Voter ID: <strong className="font-mono">{selectedApp.voterId}</strong>
                    </div>
                    <div className="text-[11px] truncate">
                      Token Hash: <strong className="font-mono">{selectedApp.tokenHash?.slice(0, 16)}...</strong>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12 text-charcoal-muted space-y-2">
                <FileText className="w-10 h-10 mx-auto text-warmBorder" />
                <p className="font-medium text-xs">Select an application from the table to review credentials and documents.</p>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: Election Phase Control */}
      {activeTab === 'phases' && (
        <div className="bg-ivory border border-warmBorder rounded-xl p-6 shadow-sm space-y-6">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-govNavy">
              Election Lifecycle Phase Control
            </h3>
            <p className="text-xs text-charcoal-muted">
              Changing the phase broadcasts a signed <strong className="font-mono">PHASE_CHANGED</strong> transaction to the blockchain. The smart contract strictly enforces voting only during the "VOTING" phase.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            {[
              {
                id: 'REGISTRATION',
                title: '1. Registration Phase',
                desc: 'NRI electors submit Form 6A applications. Officer approves credentials and mints ECDSA keys.',
              },
              {
                id: 'VOTING',
                title: '2. Live Voting Phase',
                desc: 'Electronic voting booth active. Voters submit encrypted secret ballots unlinked from identity.',
              },
              {
                id: 'COUNTING',
                title: '3. Counting Phase',
                desc: 'Voting closes. Smart contract stops accepting ballots. Election key release begins.',
              },
              {
                id: 'RESULTS_DECLARED',
                title: '4. Results Declared',
                desc: 'Decryption key released on-chain. Public tallies and constituency charts unlocked.',
              },
            ].map(p => {
              const isCurrent = phase === p.id;
              return (
                <div
                  key={p.id}
                  className={`p-4 rounded-xl border-2 transition flex flex-col justify-between ${
                    isCurrent
                      ? 'border-govSaffron bg-cream-100 shadow-md'
                      : 'border-warmBorder bg-white opacity-80'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-serif font-bold text-sm text-govNavy">{p.title}</span>
                      {isCurrent && (
                        <span className="bg-govSaffron text-white text-[10px] font-bold px-2 py-0.5 rounded">
                          CURRENT
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-charcoal-muted leading-relaxed">{p.desc}</p>
                  </div>

                  <div className="pt-4">
                    <button
                      onClick={async () => {
                        await setElectionPhase(p.id as ElectionPhase);
                        setActionNotice(`Election Phase transitioned to "${p.id}". On-chain audit logged.`);
                        setTimeout(() => setActionNotice(null), 4000);
                      }}
                      disabled={isCurrent}
                      className={`w-full py-2 rounded text-xs font-bold transition ${
                        isCurrent
                          ? 'bg-govGreen text-white cursor-default'
                          : 'bg-govNavy text-white hover:bg-govNavy-light shadow'
                      }`}
                    >
                      {isCurrent ? 'Phase Active' : `Switch to ${p.id}`}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: Candidates & Constituencies */}
      {activeTab === 'candidates' && (
        <div className="bg-ivory border border-warmBorder rounded-xl p-5 shadow-sm space-y-4">
          <div className="space-y-1">
            <h3 className="font-serif font-bold text-lg text-govNavy">
              Pre-Seeded Pilot Parliamentary Constituencies (10 Seats)
            </h3>
            <p className="text-xs text-charcoal-muted">
              Each constituency has 4 registered candidates plus the constitutional NOTA option on the ballot.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {CONSTITUENCIES.map(constituency => (
              <div key={constituency.id} className="border border-warmBorder rounded-xl p-4 bg-white space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-serif font-bold text-base text-govNavy">
                      {constituency.name} ({constituency.code})
                    </h4>
                    <span className="text-xs text-charcoal-muted">{constituency.state} &bull; {constituency.registeredElectors.toLocaleString()} electors</span>
                  </div>
                </div>

                <div className="space-y-1.5 pt-2 border-t border-warmBorder/60">
                  {constituency.candidates.map(cand => (
                    <div key={cand.id} className="flex items-center justify-between p-2 rounded bg-cream-50 text-xs">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{cand.symbolEmoji}</span>
                        <div>
                          <div className="font-bold text-charcoal">{cand.name}</div>
                          <div className="text-[10px] text-charcoal-muted">{cand.party} ({cand.partyCode})</div>
                        </div>
                      </div>
                      <span className="text-[11px] font-mono text-charcoal-muted">{cand.education}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: On-Chain Audit Log */}
      {activeTab === 'audit' && (
        <div className="bg-ivory border border-warmBorder rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 bg-cream-100 border-b border-warmBorder">
            <h3 className="font-serif font-bold text-sm text-govNavy">
              Cryptographic Administrative Audit Ledger
            </h3>
            <p className="text-xs text-charcoal-muted">
              Every officer action, approval, rejection, and phase change is permanently sealed as an on-chain block transaction.
            </p>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream-200 text-charcoal-muted uppercase text-[10px] border-b border-warmBorder">
                <tr>
                  <th className="p-3">Block #</th>
                  <th className="p-3">Tx Hash</th>
                  <th className="p-3">Action Type</th>
                  <th className="p-3">Officer / Actor</th>
                  <th className="p-3">Details</th>
                  <th className="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warmBorder/60">
                {auditLogs.map(({ transaction: tx, blockIndex }) => (
                  <tr key={tx.id} className="hover:bg-cream-50">
                    <td className="p-3 font-mono font-bold text-govNavy">#{blockIndex}</td>
                    <td className="p-3 font-mono text-[11px] text-charcoal-muted">{tx.id.slice(0, 12)}...</td>
                    <td className="p-3">
                      <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-900 border border-blue-200 font-bold text-[10px]">
                        {tx.type}
                      </span>
                    </td>
                    <td className="p-3 font-medium text-charcoal">{tx.sender}</td>
                    <td className="p-3 text-charcoal-muted">
                      {(tx.payload as { action?: string; details?: string; newPhase?: string }).details ||
                        (tx.payload as { newPhase?: string }).newPhase ||
                        'Transaction recorded'}
                    </td>
                    <td className="p-3 text-charcoal-muted">{new Date(tx.timestamp).toLocaleTimeString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
