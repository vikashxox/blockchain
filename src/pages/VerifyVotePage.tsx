import React, { useState } from 'react';
import {
  CheckCircle,
  Search,
  Shield,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  FileCheck,
  Hash,
  Database,
  Lock,
  Layers,
  Sparkles,
} from 'lucide-react';
import { useElectionStore, VoteReceipt } from '../store/electionStore';

export const VerifyVotePage: React.FC = () => {
  const { verifyVoteReceipt, latestReceipt, blockchain, t } = useElectionStore();

  const [inputHash, setInputHash] = useState('');
  const [verificationResult, setVerificationResult] = useState<{
    verified: boolean;
    receipt?: VoteReceipt;
    error?: string;
    confirmations?: number;
  } | null>(null);

  // Quick fill with latest vote receipt if available
  const handleUseLatest = () => {
    if (latestReceipt) {
      setInputHash(latestReceipt.txHash);
      handleVerify(latestReceipt.txHash);
    } else {
      // Look for any VOTE_CAST transaction on chain
      const allTxs = blockchain.getAllTransactions();
      const voteTx = allTxs.find(t => t.transaction.type === 'VOTE_CAST');
      if (voteTx) {
        setInputHash(voteTx.transaction.id);
        handleVerify(voteTx.transaction.id);
      } else {
        alert('No votes have been cast yet. Please cast a vote in the Voter Booth first.');
      }
    }
  };

  const handleVerify = (hashToVerify?: string) => {
    const target = hashToVerify || inputHash;
    const res = verifyVoteReceipt(target);
    if (res.verified && res.receipt) {
      const txInfo = blockchain.findTransaction(target);
      setVerificationResult({
        verified: true,
        receipt: res.receipt,
        confirmations: txInfo?.confirmations || 1,
      });
    } else {
      setVerificationResult({
        verified: false,
        error: res.error || 'Receipt hash not found in sovereign ledger blocks.',
      });
    }
  };

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      {/* Title card */}
      <div className="bg-ivory border border-warmBorder rounded-xl p-6 shadow-sm space-y-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-6 h-6 text-govGreen" />
          <h2 className="font-serif font-bold text-2xl text-govNavy">
            Public Vote Inclusion Verifier
          </h2>
        </div>
        <p className="text-xs text-charcoal-muted leading-relaxed">
          Any voter or member of the public can independently verify that their electronic ballot has been permanently incorporated into the Proof-of-Authority blockchain ledger.
        </p>

        {/* Privacy Note */}
        <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-xs text-emerald-900 flex items-center gap-2.5">
          <Lock className="w-4 h-4 text-emerald-700 flex-shrink-0" />
          <span>
            <strong>Zero-Knowledge Secrecy Guarantee:</strong> This public verification confirms ballot receipt and block inclusion, but cryptographically shields your choice. Your candidate selection is never revealed.
          </span>
        </div>
      </div>

      {/* Verification Search Bar */}
      <div className="bg-ivory border border-warmBorder rounded-xl p-6 shadow-sm space-y-4">
        <label className="block text-xs font-semibold text-charcoal">
          Enter Receipt Transaction Hash (SHA-256) *
        </label>

        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Hash className="w-4 h-4 text-charcoal-muted absolute left-3 top-3" />
            <input
              type="text"
              value={inputHash}
              onChange={e => setInputHash(e.target.value)}
              placeholder="Paste transaction receipt hash (e.g. 4f98a20...)"
              className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-warmBorder bg-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-govNavy"
            />
          </div>

          <button
            onClick={() => handleVerify()}
            className="px-6 py-2.5 bg-govNavy text-white font-bold text-xs rounded-lg hover:bg-govNavy-light transition shadow flex items-center justify-center gap-1.5"
          >
            <Search className="w-4 h-4" />
            <span>Verify Receipt</span>
          </button>
        </div>

        {/* Quick Helper Button */}
        <div className="flex items-center justify-between text-xs pt-1">
          <button
            onClick={handleUseLatest}
            className="text-govNavy hover:underline flex items-center gap-1 font-semibold"
          >
            <Sparkles className="w-3.5 h-3.5 text-govSaffron" />
            <span>Auto-Paste Latest Vote Receipt Hash</span>
          </button>
          <span className="text-[11px] text-charcoal-muted">
            Ledger contains {blockchain.getChain().length} blocks
          </span>
        </div>
      </div>

      {/* Verification Result Card */}
      {verificationResult && (
        <div
          className={`border-2 rounded-2xl p-6 shadow-md space-y-5 animate-fade-in ${
            verificationResult.verified
              ? 'bg-ivory border-emerald-400'
              : 'bg-rose-50 border-rose-300'
          }`}
        >
          {verificationResult.verified && verificationResult.receipt ? (
            <div className="space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center border-2 border-emerald-300">
                    <CheckCircle className="w-7 h-7" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-emerald-800 uppercase tracking-wider bg-emerald-100 px-2.5 py-0.5 rounded border border-emerald-300">
                      Included in the chain: Verified
                    </span>
                    <h3 className="font-serif font-bold text-xl text-govNavy mt-1">
                      Ballot Authenticated in Block #{verificationResult.receipt.blockIndex}
                    </h3>
                  </div>
                </div>

                <div className="text-right hidden sm:block">
                  <span className="text-xs font-bold text-emerald-700 block">
                    {verificationResult.confirmations} Block Confirmations
                  </span>
                  <span className="text-[10px] text-charcoal-muted">Irreversible state</span>
                </div>
              </div>

              {/* Cryptographic Proof Details */}
              <div className="bg-cream-100 border border-warmBorder rounded-xl p-4 space-y-2.5 text-xs font-mono">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-b border-warmBorder/60 pb-2">
                  <span className="text-charcoal-muted font-sans uppercase text-[10px]">Transaction Hash:</span>
                  <span className="font-bold text-govNavy break-all text-[11px]">
                    {verificationResult.receipt.txHash}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-b border-warmBorder/60 pb-2">
                  <span className="text-charcoal-muted font-sans uppercase text-[10px]">Block Number:</span>
                  <span className="font-bold text-charcoal">
                    Block #{verificationResult.receipt.blockIndex} (Hash: {verificationResult.receipt.blockHash.slice(0, 16)}...)
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-b border-warmBorder/60 pb-2">
                  <span className="text-charcoal-muted font-sans uppercase text-[10px]">Validator Node:</span>
                  <span className="font-bold text-emerald-800 font-sans">
                    {verificationResult.receipt.validator}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-b border-warmBorder/60 pb-2">
                  <span className="text-charcoal-muted font-sans uppercase text-[10px]">Constituency:</span>
                  <span className="font-bold text-charcoal font-sans">
                    {verificationResult.receipt.constituencyName} ({verificationResult.receipt.constituencyId})
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1 border-b border-warmBorder/60 pb-2">
                  <span className="text-charcoal-muted font-sans uppercase text-[10px]">Anonymous Token Commitment:</span>
                  <span className="text-charcoal-muted text-[11px] truncate">
                    {verificationResult.receipt.tokenHash}
                  </span>
                </div>

                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-1">
                  <span className="text-charcoal-muted font-sans uppercase text-[10px]">Timestamp Sealed:</span>
                  <span className="font-bold text-charcoal font-sans">
                    {new Date(verificationResult.receipt.timestamp).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Merkle Proof Tree Visual */}
              <div className="p-4 bg-white border border-warmBorder rounded-xl space-y-2 text-xs">
                <span className="font-bold text-govNavy font-sans flex items-center gap-1.5">
                  <Layers className="w-4 h-4 text-govSaffron" />
                  Merkle Tree Inclusion Proof
                </span>
                <p className="text-[11px] text-charcoal-muted leading-relaxed font-sans">
                  The SHA-256 hash of this ballot transaction is cryptographically combined with sibling transactions to produce the root hash sealed inside Block #{verificationResult.receipt.blockIndex}. Any alteration of even 1 bit in this ballot would cause a catastrophic Merkle root mismatch across all 3 validator nodes.
                </p>
              </div>
            </div>
          ) : (
            <div className="space-y-2 text-center py-4">
              <AlertTriangle className="w-10 h-10 text-rose-600 mx-auto" />
              <h3 className="font-serif font-bold text-lg text-rose-950">
                Verification Failed: Receipt Not Found
              </h3>
              <p className="text-xs text-rose-900 max-w-md mx-auto">
                {verificationResult.error}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
