import React from 'react';
import { Link } from 'react-router-dom';
import { Shield, Server, CheckCircle2 } from 'lucide-react';
import { NeutralEmblem } from './Emblem';
import { useElectionStore } from '../store/electionStore';
import { VALIDATOR_NODES } from '../blockchain/block';

export const Footer: React.FC = () => {
  const { t } = useElectionStore();

  return (
    <footer className="bg-[#122648] text-cream-200 mt-auto border-t-2 border-govSaffron">
      {/* PoA Validator Status Bar */}
      <div className="bg-[#0B1A33] py-2.5 px-4 sm:px-6 border-b border-white/10 text-xs">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2 text-cream-100 font-semibold">
            <Server className="w-4 h-4 text-govSaffron" />
            <span>Consensus Cluster (3 Federated PoA Validator Nodes):</span>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            {VALIDATOR_NODES.map((node, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2.5 py-1 rounded text-[11px]">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono text-cream-100">{node}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Col 1: Emblem and Identity */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <NeutralEmblem size={44} />
              <div>
                <h3 className="font-serif font-bold text-white text-lg tracking-tight">
                  {t.portalTitle}
                </h3>
                <p className="text-xs text-cream-300">
                  {t.tagline}
                </p>
              </div>
            </div>
            <p className="text-xs text-cream-300/80 leading-relaxed max-w-md">
              A verifiable, end-to-end cryptographic overseas voting demonstration. Ballots are encrypted client-side using WebCrypto, signed by anonymous ECDSA voter credentials, and sealed into an immutable Proof-of-Authority distributed ledger.
            </p>
          </div>

          {/* Col 2: Quick Links */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-govSaffron-light uppercase tracking-wider">
              Portal Services
            </h4>
            <ul className="space-y-1.5 text-xs text-cream-200">
              <li>
                <Link to="/register" className="hover:text-white transition">Overseas Registration (Form 6A-Sim)</Link>
              </li>
              <li>
                <Link to="/voter" className="hover:text-white transition">Electronic Voting Booth</Link>
              </li>
              <li>
                <Link to="/verify" className="hover:text-white transition">Public Vote Receipt Verifier</Link>
              </li>
              <li>
                <Link to="/explorer" className="hover:text-white transition">Blockchain Block & Tx Explorer</Link>
              </li>
              <li>
                <Link to="/results" className="hover:text-white transition">Constituency Decrypted Results</Link>
              </li>
              <li>
                <Link to="/roadmap" className="hover:text-white transition">Technical Roadmap & Legal Specs</Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Legal & Support */}
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-govSaffron-light uppercase tracking-wider">
              Legal & Support
            </h4>
            <ul className="space-y-1.5 text-xs text-cream-200">
              <li>
                <span className="text-cream-100 font-medium">{t.footer.helpline}</span>
              </li>
              <li>
                <a href="#accessibility" className="hover:text-white transition">{t.footer.accessibility}</a>
              </li>
              <li>
                <a href="#terms" className="hover:text-white transition">{t.footer.terms}</a>
              </li>
              <li>
                <a href="#privacy" className="hover:text-white transition">{t.footer.privacy}</a>
              </li>
              <li>
                <a href="#disclaimer" className="hover:text-white transition">{t.footer.disclaimer}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="mt-8 pt-4 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between text-[11px] text-cream-300/70 gap-2">
          <div>{t.footer.copyright}</div>
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-emerald-400" />
            <span>SHA-256 + ECDSA P-256 Cryptographic Integrity Enforced</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
