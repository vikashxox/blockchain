import React from 'react';
import {
  ShieldAlert,
  CheckCircle,
  FileText,
  AlertTriangle,
  Server,
  Lock,
  Layers,
  Scale,
  Key,
  Globe2,
} from 'lucide-react';

export const RoadmapPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      {/* Page Header */}
      <div className="bg-ivory border border-warmBorder rounded-2xl p-6 sm:p-8 shadow-sm space-y-3">
        <span className="text-[11px] font-bold text-govSaffron uppercase tracking-wider">
          Architecture Analysis & Production Readiness
        </span>
        <h2 className="font-serif font-bold text-3xl text-govNavy">
          System Limitations & Production Roadmap
        </h2>
        <p className="text-xs sm:text-sm text-charcoal-muted leading-relaxed">
          An honest, engineering-first assessment of the gap between this browser-simulated prototype and an official, legally sanctioned national remote voting infrastructure for 32 million overseas Indians.
        </p>
      </div>

      {/* Honest Prototype Limitations Section */}
      <div className="bg-ivory border-2 border-amber-300 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center gap-2 text-amber-900 font-bold text-base">
          <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0" />
          <span>Key Limitations of this Browser Demonstration Prototype</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
            <h4 className="font-bold text-amber-950">1. Browser-Simulated Consensus</h4>
            <p className="text-amber-900 leading-relaxed">
              In this demo, the 3 validator nodes (Delhi, Dubai, London) run in-memory within the presenter's browser using localStorage. A real deployment requires geographically isolated, hardware-attested server nodes.
            </p>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
            <h4 className="font-bold text-amber-950">2. Simplified Token Privacy</h4>
            <p className="text-amber-900 leading-relaxed">
              This demo uses a blind token commitment. Production requires zero-knowledge SNARKs (e.g. Circom / Groth16) or Chaumian blind RSA signatures to eliminate any server-side linkage vector.
            </p>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
            <h4 className="font-bold text-amber-950">3. Mock Identity & Biometrics</h4>
            <p className="text-amber-900 leading-relaxed">
              We simulate OTP delivery and webcam facial liveness. Real deployment requires direct integration with the Ministry of External Affairs (MEA) Passport Seva API and UIDAI Aadhaar e-KYC.
            </p>
          </div>

          <div className="p-3.5 bg-amber-50 rounded-xl border border-amber-200 space-y-1">
            <h4 className="font-bold text-amber-950">4. Key Management</h4>
            <p className="text-amber-900 leading-relaxed">
              Voter private keys are handled in browser memory. Production requires FIPS 140-3 Level 4 Hardware Security Modules (HSMs) and mobile Secure Enclave / TPM storage.
            </p>
          </div>
        </div>
      </div>

      {/* Production Engineering Roadmap */}
      <div className="space-y-4">
        <h3 className="font-serif font-bold text-xl text-govNavy">
          Production Architecture Requirements
        </h3>

        <div className="space-y-3 text-xs">
          {/* Pillar 1 */}
          <div className="p-4 bg-ivory border border-warmBorder rounded-xl shadow-sm flex items-start gap-3.5">
            <div className="p-2 rounded-lg bg-blue-50 text-blue-800 border border-blue-200">
              <Server className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-sm text-govNavy">
                1. Permissioned Enterprise Ledger (Hyperledger Fabric / Besu)
              </h4>
              <p className="text-charcoal-muted leading-relaxed">
                Operated under Byzantine Fault Tolerant (BFT) consensus between the Election Commission of India, the Supreme Court IT Registry, Indian Embassies/Consulates, and certified political party watchdog nodes. Zero gas fees, high throughput (5,000+ tx/sec), and zero public miners.
              </p>
            </div>
          </div>

          {/* Pillar 2 */}
          <div className="p-4 bg-ivory border border-warmBorder rounded-xl shadow-sm flex items-start gap-3.5">
            <div className="p-2 rounded-lg bg-purple-50 text-purple-800 border border-purple-200">
              <Lock className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-sm text-govNavy">
                2. Zero-Knowledge Proofs & Homomorphic Tallying
              </h4>
              <p className="text-charcoal-muted leading-relaxed">
                Utilizing Paillier homomorphic encryption or ElGamal on elliptic curves. Votes can be aggregated arithmetically in encrypted form without decrypting any individual ballot. Zero-knowledge range proofs ensure that each submitted ciphertext contains exactly one valid candidate vote.
              </p>
            </div>
          </div>

          {/* Pillar 3 */}
          <div className="p-4 bg-ivory border border-warmBorder rounded-xl shadow-sm flex items-start gap-3.5">
            <div className="p-2 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200">
              <ShieldAlert className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-sm text-govNavy">
                3. Coercion Resistance & "Duress" Voting Protocol
              </h4>
              <p className="text-charcoal-muted leading-relaxed">
                In remote e-voting, an employer or spouse might coerce a voter at home or workplace. Production implementations utilize the <em>Juels-Catalano-Jakobsson (JCJ)</em> protocol: voters can submit multiple votes or enter a "panic PIN" that generates a plausible dummy receipt while only their final uncoerced vote counts.
              </p>
            </div>
          </div>

          {/* Pillar 4 */}
          <div className="p-4 bg-ivory border border-warmBorder rounded-xl shadow-sm flex items-start gap-3.5">
            <div className="p-2 rounded-lg bg-amber-50 text-amber-800 border border-amber-200">
              <Scale className="w-5 h-5" />
            </div>
            <div className="space-y-1">
              <h4 className="font-serif font-bold text-sm text-govNavy">
                4. Statutory Approval & Legal Reform
              </h4>
              <p className="text-charcoal-muted leading-relaxed">
                Amendments to Section 20A of the Representation of the People Act, 1950, and the Conduct of Elections Rules, 1961, which currently require overseas electors to be physically present at the designated polling station in India to cast their vote.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
