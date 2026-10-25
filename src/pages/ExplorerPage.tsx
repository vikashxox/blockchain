import React, { useState } from 'react';
import {
  Database,
  Search,
  ShieldCheck,
  ShieldAlert,
  Layers,
  ArrowRight,
  Clock,
  Key,
  Hash,
  AlertTriangle,
  RotateCcw,
  Sparkles,
  Link as LinkIcon,
  X,
  Server,
  FileCode,
} from 'lucide-react';
import { useElectionStore } from '../store/electionStore';
import { Block } from '../blockchain/block';
import { Transaction } from '../blockchain/transaction';

export const ExplorerPage: React.FC = () => {
  const {
    blockchain,
    chainReport,
    runTamperTest,
    restoreChain,
    t,
  } = useElectionStore();

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBlock, setSelectedBlock] = useState<Block | null>(null);
  const [selectedTx, setSelectedTx] = useState<Transaction | null>(null);
  const [tamperSuccessNotice, setTamperSuccessNotice] = useState<string | null>(null);

  const chain = [...blockchain.getChain()].reverse(); // Latest blocks first
  const allTxs = blockchain.getAllTransactions().reverse();

  // Search filter
  const filteredBlocks = chain.filter(b => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return b.index.toString() === term || b.hash.toLowerCase().includes(term);
  });

  const filteredTxs = allTxs.filter(item => {
    if (!searchTerm) return true;
    const term = searchTerm.toLowerCase();
    return item.transaction.id.toLowerCase().includes(term) || item.transaction.type.toLowerCase().includes(term);
  });

  // Presentation Tamper Test Trigger
  const handleTamperClick = async () => {
    const targetBlockIndex = blockchain.getChain().length > 1 ? 1 : 0;
    await runTamperTest(targetBlockIndex);
    setTamperSuccessNotice(`Block #${targetBlockIndex} was tampered with! Cryptographic hash chain broken.`);
    setTimeout(() => setTamperSuccessNotice(null), 6000);
  };

  const handleRestoreClick = async () => {
    await restoreChain();
    setTamperSuccessNotice('Authentic state restored from consensus nodes. Blockchain valid!');
    setTimeout(() => setTamperSuccessNotice(null), 5000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Tamper Showpiece Control */}
      <div className="bg-ivory border border-warmBorder rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <Database className="w-6 h-6 text-govSaffron" />
              <h2 className="font-serif font-bold text-2xl text-govNavy">
                Public Sovereign Blockchain Explorer
              </h2>
            </div>
            <p className="text-xs text-charcoal-muted mt-1 leading-relaxed">
              Real-time inspection of distributed ledger blocks, transaction proofs, and Proof-of-Authority consensus signatures.
            </p>
          </div>

          {/* Tamper Test Showcase Button (The Key Presentation Showpiece) */}
          <div className="flex flex-wrap items-center gap-2">
            {chainReport.isValid ? (
              <button
                onClick={handleTamperClick}
                className="px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                title="Simulate attacker altering database vote data"
              >
                <ShieldAlert className="w-4 h-4 animate-bounce" />
                <span>Simulate Database Tamper (Break Chain)</span>
              </button>
            ) : (
              <button
                onClick={handleRestoreClick}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl shadow-md transition flex items-center gap-1.5"
                title="Restore genuine chain state from consensus quorum"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Restore Authentic Ledger</span>
              </button>
            )}
          </div>
        </div>

        {/* Notice alert */}
        {tamperSuccessNotice && (
          <div className={`p-3 rounded-lg text-xs font-semibold flex items-center gap-2 animate-fade-in ${chainReport.isValid ? 'bg-emerald-50 text-emerald-900 border border-emerald-300' : 'bg-rose-50 text-rose-900 border border-rose-300'}`}>
            <Sparkles className="w-4 h-4 flex-shrink-0" />
            <span>{tamperSuccessNotice}</span>
          </div>
        )}

        {/* Chain Integrity Visualizer Card */}
        <div
          className={`p-4 rounded-xl border-2 transition ${
            chainReport.isValid
              ? 'bg-emerald-50/70 border-emerald-300 text-emerald-950'
              : 'bg-rose-100 border-rose-500 text-rose-950 animate-pulse'
          }`}
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${
                  chainReport.isValid ? 'bg-emerald-600' : 'bg-rose-600 animate-spin-slow'
                }`}
              >
                {chainReport.isValid ? <ShieldCheck className="w-6 h-6" /> : <ShieldAlert className="w-6 h-6" />}
              </div>
              <div>
                <div className="font-bold text-sm">
                  {chainReport.isValid
                    ? 'Cryptographic Ledger Integrity: 100% Valid'
                    : `CRITICAL ALERT: Chain Integrity Broken at Block #${chainReport.tamperedBlockIndex}`}
                </div>
                <div className="text-xs opacity-90">
                  {chainReport.isValid
                    ? `All ${chainReport.totalBlocks} blocks and ${chainReport.totalTransactions} transactions mathematically verified against SHA-256 headers.`
                    : `Violation Reason: ${chainReport.reason || 'Transaction payload hash mismatch with Merkle root.'}`}
                </div>
              </div>
            </div>

            {!chainReport.isValid && (
              <div className="self-end sm:self-auto">
                <button
                  onClick={handleRestoreClick}
                  className="px-3 py-1.5 bg-rose-700 text-white rounded font-bold text-xs hover:bg-rose-800 transition"
                >
                  Restore Valid State
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-charcoal-muted absolute left-3 top-3" />
          <input
            type="text"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by block index, block hash (0000...), or transaction ID..."
            className="w-full pl-9 pr-3 py-2.5 rounded-lg border border-warmBorder bg-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-govNavy"
          />
        </div>
      </div>

      {/* Blocks and Transactions Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Latest Blocks List */}
        <div className="bg-ivory border border-warmBorder rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 bg-cream-100 border-b border-warmBorder flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm text-govNavy flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-govSaffron" />
              <span>Confirmed Blocks ({filteredBlocks.length})</span>
            </h3>
            <span className="text-[11px] text-charcoal-muted">PoA Difficulty = 2</span>
          </div>

          <div className="divide-y divide-warmBorder/60 max-h-[500px] overflow-y-auto">
            {filteredBlocks.map(block => {
              const isTamperedBlock = !chainReport.isValid && chainReport.tamperedBlockIndex === block.index;

              return (
                <div
                  key={block.index}
                  onClick={() => setSelectedBlock(block)}
                  className={`p-3.5 transition cursor-pointer ${
                    isTamperedBlock
                      ? 'bg-rose-100/90 border-l-4 border-rose-600'
                      : 'hover:bg-cream-50 bg-white'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-bold text-sm text-govNavy">
                        Block #{block.index}
                      </span>
                      {block.index === 0 && (
                        <span className="bg-govSaffron text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase">
                          GENESIS
                        </span>
                      )}
                      {isTamperedBlock && (
                        <span className="bg-rose-600 text-white text-[9px] font-bold px-1.5 py-0.2 rounded uppercase animate-pulse">
                          CORRUPTED
                        </span>
                      )}
                    </div>
                    <span className="text-[11px] text-charcoal-muted">
                      {new Date(block.timestamp).toLocaleTimeString()}
                    </span>
                  </div>

                  <div className="mt-1 text-xs font-mono text-charcoal-muted truncate">
                    Hash: <strong className="text-charcoal">{block.hash.slice(0, 20)}...</strong>
                  </div>

                  <div className="mt-2 flex items-center justify-between text-[11px]">
                    <span className="text-emerald-800 font-medium">{block.validator}</span>
                    <span className="bg-cream-200 px-2 py-0.5 rounded border border-warmBorder text-charcoal font-semibold">
                      {block.transactions.length} txs
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Latest Transactions List */}
        <div className="bg-ivory border border-warmBorder rounded-xl shadow-sm overflow-hidden">
          <div className="p-4 bg-cream-100 border-b border-warmBorder flex items-center justify-between">
            <h3 className="font-serif font-bold text-sm text-govNavy flex items-center gap-1.5">
              <FileCode className="w-4 h-4 text-govNavy" />
              <span>Confirmed Transactions ({filteredTxs.length})</span>
            </h3>
            <span className="text-[11px] text-charcoal-muted">Latest first</span>
          </div>

          <div className="divide-y divide-warmBorder/60 max-h-[500px] overflow-y-auto">
            {filteredTxs.map(({ transaction: tx, blockIndex }) => {
              const typeColor = {
                VOTE_CAST: 'bg-emerald-100 text-emerald-900 border-emerald-300',
                VOTER_REGISTERED: 'bg-blue-100 text-blue-900 border-blue-300',
                TOKEN_ISSUED: 'bg-purple-100 text-purple-900 border-purple-300',
                PHASE_CHANGED: 'bg-amber-100 text-amber-900 border-amber-300',
                ADMIN_AUDIT: 'bg-gray-100 text-gray-800 border-gray-300',
                RESULT_PUBLISHED: 'bg-indigo-100 text-indigo-900 border-indigo-300',
                ELECTION_CREATED: 'bg-cyan-100 text-cyan-900 border-cyan-300',
              }[tx.type] || 'bg-gray-100 text-gray-800';

              return (
                <div
                  key={tx.id}
                  onClick={() => setSelectedTx(tx)}
                  className="p-3.5 hover:bg-cream-50 bg-white transition cursor-pointer"
                >
                  <div className="flex items-start justify-between gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${typeColor}`}>
                      {tx.type}
                    </span>
                    <span className="font-mono text-[11px] text-govNavy font-semibold">
                      Block #{blockIndex}
                    </span>
                  </div>

                  <div className="mt-1.5 font-mono text-[11px] text-charcoal truncate">
                    Tx ID: {tx.id}
                  </div>

                  <div className="mt-1 flex items-center justify-between text-[11px] text-charcoal-muted">
                    <span>Sender: {tx.sender.slice(0, 16)}...</span>
                    <span>{new Date(tx.timestamp).toLocaleTimeString()}</span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Block Detail Modal */}
      {selectedBlock && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-ivory border-2 border-warmBorder rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] flex flex-col overflow-hidden text-charcoal animate-fade-in">
            <div className="bg-govNavy text-white px-5 py-3.5 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Layers className="w-5 h-5 text-govSaffron" />
                <h3 className="font-serif font-bold text-base">
                  Block #{selectedBlock.index} Details
                </h3>
              </div>
              <button
                onClick={() => setSelectedBlock(null)}
                className="p-1 rounded hover:bg-white/20 text-cream-200 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-5 overflow-y-auto space-y-3 text-xs font-mono">
              <div className="bg-white p-3 rounded-lg border border-warmBorder space-y-1.5">
                <div>
                  <span className="text-charcoal-muted font-sans uppercase text-[10px] block">Block Hash:</span>
                  <span className="font-bold text-govNavy break-all text-[11px]">{selectedBlock.hash}</span>
                </div>
                <div>
                  <span className="text-charcoal-muted font-sans uppercase text-[10px] block">Previous Block Hash:</span>
                  <span className="break-all text-[11px] text-charcoal-muted">{selectedBlock.previousHash}</span>
                </div>
                <div>
                  <span className="text-charcoal-muted font-sans uppercase text-[10px] block">Merkle Root:</span>
                  <span className="break-all text-[11px] text-charcoal-muted">{selectedBlock.merkleRoot}</span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 pt-1 font-sans text-xs">
                  <div>
                    <span className="text-charcoal-muted text-[10px] block">Validator:</span>
                    <strong className="text-emerald-800">{selectedBlock.validator}</strong>
                  </div>
                  <div>
                    <span className="text-charcoal-muted text-[10px] block">Nonce:</span>
                    <strong>{selectedBlock.nonce}</strong>
                  </div>
                  <div>
                    <span className="text-charcoal-muted text-[10px] block">Transactions:</span>
                    <strong>{selectedBlock.transactions.length}</strong>
                  </div>
                </div>
              </div>

              {/* Transactions in this block */}
              <div className="space-y-1.5">
                <span className="font-sans font-bold text-sm text-govNavy block">
                  Transactions in this Block:
                </span>
                {selectedBlock.transactions.map((tx, idx) => (
                  <div key={tx.id} className="p-2.5 rounded bg-cream-50 border border-warmBorder text-xs space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-bold text-govNavy font-sans">{idx + 1}. {tx.type}</span>
                      <span className="text-[10px] text-charcoal-muted">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-[11px] text-charcoal-muted truncate">ID: {tx.id}</div>
                    <pre className="text-[10px] bg-white p-1.5 rounded border border-warmBorder/60 overflow-x-auto text-charcoal">
                      {JSON.stringify(tx.payload, null, 2)}
                    </pre>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-cream-100 border-t border-warmBorder px-5 py-2.5 flex justify-end">
              <button
                onClick={() => setSelectedBlock(null)}
                className="px-4 py-1.5 bg-govNavy text-white rounded font-medium text-xs hover:bg-govNavy-light transition"
              >
                Close Block View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Transaction Detail Modal */}
      {selectedTx && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div className="bg-ivory border-2 border-warmBorder rounded-2xl shadow-2xl max-w-xl w-full p-5 space-y-4 text-charcoal animate-fade-in text-xs font-mono">
            <div className="flex items-center justify-between font-sans border-b border-warmBorder pb-2">
              <h3 className="font-bold text-base text-govNavy">
                Transaction Detail: {selectedTx.type}
              </h3>
              <button onClick={() => setSelectedTx(null)} className="p-1 text-charcoal-muted hover:text-charcoal">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2 bg-white p-3 rounded-lg border border-warmBorder">
              <div>
                <span className="text-charcoal-muted font-sans text-[10px] uppercase block">Transaction ID (Hash):</span>
                <span className="font-bold text-govNavy break-all text-[11px]">{selectedTx.id}</span>
              </div>
              <div>
                <span className="text-charcoal-muted font-sans text-[10px] uppercase block">Sender Identity:</span>
                <span className="break-all text-[11px]">{selectedTx.sender}</span>
              </div>
              <div>
                <span className="text-charcoal-muted font-sans text-[10px] uppercase block">Timestamp:</span>
                <span className="font-sans text-xs">{new Date(selectedTx.timestamp).toLocaleString()}</span>
              </div>
            </div>

            <div className="space-y-1">
              <span className="font-sans font-bold text-xs text-govNavy block">Payload Content:</span>
              <pre className="p-3 bg-cream-50 rounded-lg border border-warmBorder overflow-x-auto text-[11px] text-charcoal max-h-60">
                {JSON.stringify(selectedTx.payload, null, 2)}
              </pre>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedTx(null)}
                className="px-4 py-1.5 bg-govNavy text-white rounded font-sans text-xs font-semibold hover:bg-govNavy-light transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
