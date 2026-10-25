import React, { createContext, useContext, useEffect, useState, useCallback, ReactNode } from 'react';
import { Blockchain, ChainValidationReport } from '../blockchain/blockchain';
import { ElectionPhase } from '../contracts/votingContract';
import { generateVoterKeyPair, sha256, encryptBallot } from '../blockchain/crypto';
import { CONSTITUENCIES, DEMO_VOTERS, COUNTRIES, Candidate, Constituency } from '../utils/seedData';
import { Language, translations } from '../i18n/translations';

export interface VoterApplication {
  id: string; // Reference ID, e.g. APP-2026-DXB-9102
  fullName: string;
  dob: string;
  gender: string;
  email: string;
  mobile: string;
  countryCode: string;
  countryName: string;
  passportNumber: string;
  passportIssueDate: string;
  passportExpiryDate: string;
  lastIndianAddress: string;
  constituencyId: string;
  constituencyName: string;
  passportDocBase64: string;
  photoDocBase64: string;
  status: 'PENDING' | 'UNDER_REVIEW' | 'APPROVED' | 'REJECTED';
  rejectionReason?: string;
  voterId?: string;
  voterToken?: string;
  tokenHash?: string;
  privateKeyPem?: string;
  publicKeyPem?: string;
  registeredTxId?: string;
  hasVoted?: boolean;
  createdAt: number;
}

export interface OutboxMessage {
  id: string;
  recipient: string; // Mobile or Email
  channel: 'SMS' | 'EMAIL';
  subject?: string;
  message: string;
  timestamp: number;
  read: boolean;
}

export interface VoteReceipt {
  txHash: string;
  blockIndex: number;
  blockHash: string;
  timestamp: number;
  constituencyId: string;
  constituencyName: string;
  validator: string;
  tokenHash: string;
}

export interface ElectionStoreContextType {
  blockchain: Blockchain;
  chainReport: ChainValidationReport;
  phase: ElectionPhase;
  applications: VoterApplication[];
  outbox: OutboxMessage[];
  unreadOutboxCount: number;
  currentVoter: VoterApplication | null;
  isAdmin: boolean;
  latestReceipt: VoteReceipt | null;
  constituencies: Constituency[];
  language: Language;
  t: typeof translations['en'];
  highContrast: boolean;
  textSize: 'normal' | 'large' | 'xlarge';
  
  // Actions
  setLanguage: (lang: Language) => void;
  setHighContrast: (contrast: boolean) => void;
  setTextSize: (size: 'normal' | 'large' | 'xlarge') => void;
  loginAsAdmin: (pass: string) => boolean;
  logoutAdmin: () => void;
  loginVoter: (voterIdOrRef: string, otpOrKey?: string) => { success: boolean; error?: string };
  logoutVoter: () => void;
  submitApplication: (data: Omit<VoterApplication, 'id' | 'status' | 'createdAt'>) => Promise<string>;
  approveApplication: (appId: string) => Promise<boolean>;
  rejectApplication: (appId: string, reason: string) => Promise<boolean>;
  setElectionPhase: (phase: ElectionPhase) => Promise<void>;
  castVote: (candidateId: string) => Promise<{ success: boolean; receipt?: VoteReceipt; error?: string }>;
  verifyVoteReceipt: (receiptHash: string) => { verified: boolean; receipt?: VoteReceipt; error?: string };
  runTamperTest: (blockIndex?: number) => Promise<void>;
  restoreChain: () => Promise<void>;
  seedDemoVoters: () => Promise<void>;
  resetDemoData: () => Promise<void>;
  markOutboxRead: () => void;
  fastForwardToPhase: (targetPhase: ElectionPhase) => Promise<void>;
}

const ElectionStoreContext = createContext<ElectionStoreContextType | null>(null);

const STORAGE_KEY_CHAIN = 'pravasi_chain_v1';
const STORAGE_KEY_APPS = 'pravasi_apps_v1';
const STORAGE_KEY_OUTBOX = 'pravasi_outbox_v1';
const STORAGE_KEY_RECEIPTS = 'pravasi_receipts_v1';

export const ElectionStoreProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [blockchain] = useState<Blockchain>(() => new Blockchain());
  const [chainReport, setChainReport] = useState<ChainValidationReport>({
    isValid: true,
    totalBlocks: 1,
    totalTransactions: 1,
  });
  const [phase, setPhase] = useState<ElectionPhase>('REGISTRATION');
  const [applications, setApplications] = useState<VoterApplication[]>([]);
  const [outbox, setOutbox] = useState<OutboxMessage[]>([]);
  const [currentVoter, setCurrentVoter] = useState<VoterApplication | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [latestReceipt, setLatestReceipt] = useState<VoteReceipt | null>(null);
  const [language, setLanguage] = useState<Language>('en');
  const [highContrast, setHighContrast] = useState<boolean>(false);
  const [textSize, setTextSize] = useState<'normal' | 'large' | 'xlarge'>('normal');

  // Translation accessor
  const t = translations[language];

  // Refresh chain validity report
  const refreshChainReport = useCallback(async () => {
    const report = await blockchain.verifyChain();
    setChainReport(report);
    setPhase(blockchain.getContract().getPhase());
  }, [blockchain]);

  // Load from localStorage or initialize with seed data
  useEffect(() => {
    const initializeLedger = async () => {
      const savedChain = localStorage.getItem(STORAGE_KEY_CHAIN);
      if (savedChain) {
        blockchain.fromJSON(savedChain);
      } else {
        await blockchain.initialize();
      }

      const savedApps = localStorage.getItem(STORAGE_KEY_APPS);
      if (savedApps) {
        try {
          setApplications(JSON.parse(savedApps));
        } catch {
          setApplications([]);
        }
      } else {
        // Pre-seed initial 5 applications (3 approved demo voters, 1 pending, 1 under review)
        const initialApps: VoterApplication[] = DEMO_VOTERS.slice(0, 5).map((dv, index) => {
          const status = index === 3 ? 'PENDING' : index === 4 ? 'UNDER_REVIEW' : 'APPROVED';
          return {
            id: dv.applicationRef,
            fullName: dv.name,
            dob: '1985-05-15',
            gender: 'Male',
            email: dv.email,
            mobile: dv.mobile,
            countryCode: dv.countryCode,
            countryName: dv.countryName,
            passportNumber: dv.passportNumber,
            passportIssueDate: '2020-01-10',
            passportExpiryDate: '2030-01-09',
            lastIndianAddress: 'Sector 4, Rohini, New Delhi, India',
            constituencyId: dv.constituencyId,
            constituencyName: dv.constituencyName,
            passportDocBase64: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="300" height="200" fill="%231E3A8A"/><text x="20" y="40" fill="white" font-size="16">PASSPORT OF INDIA</text><text x="20" y="80" fill="%23FCD34D" font-size="14">NRI EMIGRATION CLEARANCE</text></svg>',
            photoDocBase64: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect width="150" height="150" fill="%23E2E8F0"/><circle cx="75" cy="60" r="35" fill="%2394A3B8"/><path d="M20 140 Q75 90 130 140 Z" fill="%2364748B"/></svg>',
            status: status as 'PENDING' | 'UNDER_REVIEW' | 'APPROVED',
            voterId: status === 'APPROVED' ? dv.id : undefined,
            voterToken: status === 'APPROVED' ? dv.voterToken : undefined,
            tokenHash: status === 'APPROVED' ? dv.tokenHash : undefined,
            createdAt: Date.now() - (5 - index) * 3600000,
          };
        });
        setApplications(initialApps);
        localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(initialApps));
      }

      const savedOutbox = localStorage.getItem(STORAGE_KEY_OUTBOX);
      if (savedOutbox) {
        try {
          setOutbox(JSON.parse(savedOutbox));
        } catch {
          setOutbox([]);
        }
      }

      await refreshChainReport();
    };

    initializeLedger();

    const unsubscribe = blockchain.subscribe(() => {
      refreshChainReport();
      localStorage.setItem(STORAGE_KEY_CHAIN, blockchain.toJSON());
    });

    return () => unsubscribe();
  }, [blockchain, refreshChainReport]);

  // Save applications to localStorage whenever changed
  useEffect(() => {
    if (applications.length > 0) {
      localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(applications));
    }
  }, [applications]);

  // Save outbox to localStorage
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY_OUTBOX, JSON.stringify(outbox));
  }, [outbox]);

  const addOutboxMessage = useCallback((recipient: string, channel: 'SMS' | 'EMAIL', message: string, subject?: string) => {
    const newMsg: OutboxMessage = {
      id: `MSG-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      recipient,
      channel,
      subject,
      message,
      timestamp: Date.now(),
      read: false,
    };
    setOutbox(prev => [newMsg, ...prev]);
  }, []);

  const markOutboxRead = useCallback(() => {
    setOutbox(prev => prev.map(m => ({ ...m, read: true })));
  }, []);

  const unreadOutboxCount = outbox.filter(m => !m.read).length;

  // Admin login
  const loginAsAdmin = useCallback((pass: string): boolean => {
    if (pass === 'admin123') {
      setIsAdmin(true);
      return true;
    }
    return false;
  }, []);

  const logoutAdmin = useCallback(() => {
    setIsAdmin(false);
  }, []);

  // Voter login
  const loginVoter = useCallback((voterIdOrRef: string, otpOrKey?: string): { success: boolean; error?: string } => {
    const trimmed = voterIdOrRef.trim().toUpperCase();
    const app = applications.find(
      a => (a.voterId && a.voterId.toUpperCase() === trimmed) ||
           (a.id && a.id.toUpperCase() === trimmed) ||
           (a.passportNumber && a.passportNumber.toUpperCase() === trimmed)
    );

    if (!app) {
      return { success: false, error: 'No voter record found with provided Voter ID or Application Reference.' };
    }

    if (app.status !== 'APPROVED') {
      return {
        success: false,
        error: `Your application status is "${app.status}". Only approved overseas voters can access the voting portal.`,
      };
    }

    // In demo mode, if OTP or private key is supplied (or matched demo shortcut), login succeeds
    setCurrentVoter(app);
    return { success: true };
  }, [applications]);

  const logoutVoter = useCallback(() => {
    setCurrentVoter(null);
  }, []);

  // Submit new registration
  const submitApplication = useCallback(async (data: Omit<VoterApplication, 'id' | 'status' | 'createdAt'>): Promise<string> => {
    const refId = `APP-2026-${data.countryCode}-${Math.floor(1000 + Math.random() * 9000)}`;
    const newApp: VoterApplication = {
      ...data,
      id: refId,
      status: 'PENDING',
      createdAt: Date.now(),
    };

    setApplications(prev => [newApp, ...prev]);

    // Send confirmation SMS/Email to outbox
    addOutboxMessage(
      data.mobile,
      'SMS',
      `[ECI Pravasi] Application received! Your Overseas Voter Reference ID is ${refId}. Tracking link sent to your registered email.`
    );
    addOutboxMessage(
      data.email,
      'EMAIL',
      `Dear ${data.fullName},\nYour application for overseas voter registration for constituency ${data.constituencyName} has been received.\nReference ID: ${refId}\nStatus: PENDING REVIEW.`,
      `Overseas Voter Application Received (${refId})`
    );

    return refId;
  }, [addOutboxMessage]);

  // Admin approves application
  const approveApplication = useCallback(async (appId: string): Promise<boolean> => {
    const app = applications.find(a => a.id === appId);
    if (!app) return false;

    // 1. Generate WebCrypto ECDSA P-256 Voter Keypair
    const keyPair = await generateVoterKeyPair();

    // 2. Generate voter identity hash (never store raw PII on chain!)
    const voterIdHash = await sha256(`${app.passportNumber}:PravasiSalt:${app.countryCode}`);
    const voterId = `NRI-IND-${Math.floor(7100 + Math.random() * 2800)}`;
    const voterToken = `VTK-${app.countryCode}-${Math.floor(100000 + Math.random() * 900000)}`;
    const tokenHash = await sha256(`TOKEN:${voterToken}:${voterIdHash}`);

    // 3. Register transaction on chain
    const regTx = await blockchain.addTransaction('VOTER_REGISTERED', 'ELECTION_OFFICER', {
      voterIdHash,
      voterPublicKey: keyPair.publicKeyPem,
      constituencyId: app.constituencyId,
      countryCode: app.countryCode,
      registrationRef: app.id,
    });

    // 4. Issue anonymous voting token transaction on chain
    await blockchain.addTransaction('TOKEN_ISSUED', 'SMART_CONTRACT', {
      tokenHash,
      constituencyId: app.constituencyId,
      issueTimestamp: Date.now(),
    });

    // 5. Update application record
    const updated: VoterApplication = {
      ...app,
      status: 'APPROVED',
      voterId,
      voterToken,
      tokenHash,
      privateKeyPem: keyPair.privateKeyPem,
      publicKeyPem: keyPair.publicKeyPem,
      registeredTxId: regTx.id,
    };

    setApplications(prev => prev.map(a => (a.id === appId ? updated : a)));

    // Send credentials notification
    addOutboxMessage(
      app.email,
      'EMAIL',
      `Dear ${app.fullName},\nCongratulations! Your NRI Voter Application has been APPROVED.\nVoter ID: ${voterId}\nConstituency: ${app.constituencyName}\nOne-time Voting Token: ${voterToken}\nYour cryptographic private key has been generated and enrolled on the Pravasi blockchain.`,
      `NRI Voter Registration APPROVED - Voter ID: ${voterId}`
    );

    addOutboxMessage(
      app.mobile,
      'SMS',
      `[ECI Pravasi] Application APPROVED! Voter ID: ${voterId}. Token: ${voterToken}. Log in at portal during voting phase.`
    );

    // Audit log on chain
    await blockchain.addTransaction('ADMIN_AUDIT', 'ELECTION_OFFICER', {
      officerId: 'OFFICER-HQ-DELHI',
      action: 'APPROVE_VOTER_APPLICATION',
      details: `Voter ${voterId} approved for constituency ${app.constituencyId}`,
      targetId: app.id,
    });

    return true;
  }, [applications, blockchain, addOutboxMessage]);

  // Admin rejects application
  const rejectApplication = useCallback(async (appId: string, reason: string): Promise<boolean> => {
    const app = applications.find(a => a.id === appId);
    if (!app) return false;

    const updated: VoterApplication = {
      ...app,
      status: 'REJECTED',
      rejectionReason: reason,
    };

    setApplications(prev => prev.map(a => (a.id === appId ? updated : a)));

    addOutboxMessage(
      app.email,
      'EMAIL',
      `Dear ${app.fullName},\nYour application for NRI Voter registration (${app.id}) was not approved.\nReason: ${reason}\nYou may submit an appeal or re-apply with corrected documentation.`,
      `NRI Voter Application Status Update: Rejected (${app.id})`
    );

    await blockchain.addTransaction('ADMIN_AUDIT', 'ELECTION_OFFICER', {
      officerId: 'OFFICER-HQ-DELHI',
      action: 'REJECT_VOTER_APPLICATION',
      details: `Application ${app.id} rejected. Reason: ${reason}`,
      targetId: app.id,
    });

    return true;
  }, [applications, blockchain, addOutboxMessage]);

  // Set election phase
  const setElectionPhase = useCallback(async (newPhase: ElectionPhase): Promise<void> => {
    const prevPhase = blockchain.getContract().getPhase();
    blockchain.getContract().setPhase(newPhase);

    await blockchain.addTransaction('PHASE_CHANGED', 'ELECTION_OFFICER', {
      electionId: 'LOKSABHA-NRI-2026',
      previousPhase: prevPhase,
      newPhase,
      officerId: 'CHIEF_ELECTION_COMMISSIONER',
      timestamp: Date.now(),
    });

    setPhase(newPhase);
    await refreshChainReport();
  }, [blockchain, refreshChainReport]);

  // Fast forward helper for Demo Guide
  const fastForwardToPhase = useCallback(async (targetPhase: ElectionPhase): Promise<void> => {
    await setElectionPhase(targetPhase);
  }, [setElectionPhase]);

  // Cast vote
  const castVote = useCallback(async (candidateId: string): Promise<{ success: boolean; receipt?: VoteReceipt; error?: string }> => {
    if (!currentVoter) {
      return { success: false, error: 'No active voter session. Please log in first.' };
    }

    if (currentVoter.hasVoted) {
      return {
        success: false,
        error: 'Double voting prevention: You have already cast a vote in this session!',
      };
    }

    const tokenHash = currentVoter.tokenHash || (await sha256(`TOKEN:${currentVoter.voterToken}`));

    // Encrypt ballot using election public key
    const electionPublicKey = blockchain.getContract().getElectionPublicKey();
    const encryptedBallot = await encryptBallot(candidateId, currentVoter.constituencyId, electionPublicKey);

    try {
      // Add vote transaction to blockchain
      const tx = await blockchain.addTransaction('VOTE_CAST', tokenHash, {
        tokenHash,
        encryptedBallot,
        constituencyId: currentVoter.constituencyId,
        signature: `SIG_P256_${tokenHash.slice(0, 16)}`,
      });

      // Find block containing the vote
      const block = blockchain.getLatestBlock();

      const receipt: VoteReceipt = {
        txHash: tx.id,
        blockIndex: block.index,
        blockHash: block.hash,
        timestamp: tx.timestamp,
        constituencyId: currentVoter.constituencyId,
        constituencyName: currentVoter.constituencyName,
        validator: block.validator,
        tokenHash,
      };

      setLatestReceipt(receipt);

      // Save receipt to localStorage
      const savedReceipts = JSON.parse(localStorage.getItem(STORAGE_KEY_RECEIPTS) || '{}');
      savedReceipts[tx.id] = receipt;
      localStorage.setItem(STORAGE_KEY_RECEIPTS, JSON.stringify(savedReceipts));

      // Mark voter as hasVoted
      const updatedVoter: VoterApplication = { ...currentVoter, hasVoted: true };
      setCurrentVoter(updatedVoter);
      setApplications(prev => prev.map(a => (a.id === currentVoter.id ? updatedVoter : a)));

      // Outbox notification
      addOutboxMessage(
        currentVoter.email,
        'EMAIL',
        `Dear Voter,\nYour secret electronic ballot has been cryptographically signed and confirmed into Block #${receipt.blockIndex} of the Pravasi Matdan ledger.\nTx Hash: ${receipt.txHash}\nValidator: ${receipt.validator}\nYour vote receipt can be independently verified on the public blockchain explorer.`,
        `Official Vote Confirmation & Receipt #${receipt.txHash.slice(0, 10)}`
      );

      return { success: true, receipt };
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      return { success: false, error: msg };
    }
  }, [currentVoter, blockchain, addOutboxMessage]);

  // Verify vote receipt
  const verifyVoteReceipt = useCallback((receiptHash: string): { verified: boolean; receipt?: VoteReceipt; error?: string } => {
    const trimmed = receiptHash.trim();
    if (!trimmed) {
      return { verified: false, error: 'Please enter a transaction hash.' };
    }

    const txInfo = blockchain.findTransaction(trimmed);
    if (!txInfo) {
      return { verified: false, error: 'Transaction hash was not found in any mined block.' };
    }

    if (txInfo.transaction.type !== 'VOTE_CAST') {
      return { verified: false, error: 'Transaction found, but it is not a VOTE_CAST transaction.' };
    }

    const payload = txInfo.transaction.payload as { constituencyId: string; tokenHash: string };
    const constObj = CONSTITUENCIES.find(c => c.id === payload.constituencyId);

    const receipt: VoteReceipt = {
      txHash: txInfo.transaction.id,
      blockIndex: txInfo.block.index,
      blockHash: txInfo.block.hash,
      timestamp: txInfo.transaction.timestamp,
      constituencyId: payload.constituencyId,
      constituencyName: constObj ? constObj.name : 'Overseas Constituency',
      validator: txInfo.block.validator,
      tokenHash: payload.tokenHash,
    };

    return { verified: true, receipt };
  }, [blockchain]);

  // Presentation Tamper Test
  const runTamperTest = useCallback(async (blockIndex?: number): Promise<void> => {
    const targetIdx = blockIndex !== undefined ? blockIndex : (blockchain.getChain().length > 1 ? 1 : 0);
    blockchain.tamperBlock(targetIdx, '[TAMPERED BY ATTACKER] Candidate ballot modified illicitly');
    await refreshChainReport();
  }, [blockchain, refreshChainReport]);

  const restoreChain = useCallback(async (): Promise<void> => {
    blockchain.restoreChain();
    await refreshChainReport();
  }, [blockchain, refreshChainReport]);

  // Seed demo voters (20 pre-approved voters)
  const seedDemoVoters = useCallback(async (): Promise<void> => {
    const newApps: VoterApplication[] = [];

    for (let i = 0; i < DEMO_VOTERS.length; i++) {
      const dv = DEMO_VOTERS[i];
      const keyPair = await generateVoterKeyPair();
      const voterIdHash = await sha256(`${dv.passportNumber}:PravasiSalt:${dv.countryCode}`);

      // Add to chain
      await blockchain.addTransaction('VOTER_REGISTERED', 'ELECTION_OFFICER', {
        voterIdHash,
        voterPublicKey: keyPair.publicKeyPem,
        constituencyId: dv.constituencyId,
        countryCode: dv.countryCode,
        registrationRef: dv.applicationRef,
      });

      await blockchain.addTransaction('TOKEN_ISSUED', 'SMART_CONTRACT', {
        tokenHash: dv.tokenHash,
        constituencyId: dv.constituencyId,
        issueTimestamp: Date.now() - (20 - i) * 60000,
      });

      newApps.push({
        id: dv.applicationRef,
        fullName: dv.name,
        dob: '1988-04-12',
        gender: i % 2 === 0 ? 'Male' : 'Female',
        email: dv.email,
        mobile: dv.mobile,
        countryCode: dv.countryCode,
        countryName: dv.countryName,
        passportNumber: dv.passportNumber,
        passportIssueDate: '2021-02-15',
        passportExpiryDate: '2031-02-14',
        lastIndianAddress: 'Mall Road, Civil Lines, India',
        constituencyId: dv.constituencyId,
        constituencyName: dv.constituencyName,
        passportDocBase64: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="300" height="200"><rect width="300" height="200" fill="%231E3A8A"/><text x="20" y="40" fill="white" font-size="16">REPUBLIC OF INDIA PASSPORT</text></svg>',
        photoDocBase64: 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="150" height="150"><rect width="150" height="150" fill="%23E2E8F0"/><circle cx="75" cy="60" r="35" fill="%2394A3B8"/><path d="M20 140 Q75 90 130 140 Z" fill="%2364748B"/></svg>',
        status: 'APPROVED',
        voterId: dv.id,
        voterToken: dv.voterToken,
        tokenHash: dv.tokenHash,
        privateKeyPem: keyPair.privateKeyPem,
        publicKeyPem: keyPair.publicKeyPem,
        hasVoted: false,
        createdAt: Date.now() - (20 - i) * 60000,
      });
    }

    setApplications(newApps);
    localStorage.setItem(STORAGE_KEY_APPS, JSON.stringify(newApps));
    await refreshChainReport();
  }, [blockchain, refreshChainReport]);

  // Reset demo data
  const resetDemoData = useCallback(async (): Promise<void> => {
    localStorage.removeItem(STORAGE_KEY_CHAIN);
    localStorage.removeItem(STORAGE_KEY_APPS);
    localStorage.removeItem(STORAGE_KEY_OUTBOX);
    localStorage.removeItem(STORAGE_KEY_RECEIPTS);

    window.location.reload();
  }, []);

  return (
    <ElectionStoreContext.Provider
      value={{
        blockchain,
        chainReport,
        phase,
        applications,
        outbox,
        unreadOutboxCount,
        currentVoter,
        isAdmin,
        latestReceipt,
        constituencies: CONSTITUENCIES,
        language,
        t,
        highContrast,
        textSize,
        setLanguage,
        setHighContrast,
        setTextSize,
        loginAsAdmin,
        logoutAdmin,
        loginVoter,
        logoutVoter,
        submitApplication,
        approveApplication,
        rejectApplication,
        setElectionPhase,
        castVote,
        verifyVoteReceipt,
        runTamperTest,
        restoreChain,
        seedDemoVoters,
        resetDemoData,
        markOutboxRead,
        fastForwardToPhase,
      }}
    >
      {children}
    </ElectionStoreContext.Provider>
  );
};

export const useElectionStore = (): ElectionStoreContextType => {
  const context = useContext(ElectionStoreContext);
  if (!context) {
    throw new Error('useElectionStore must be used within an ElectionStoreProvider');
  }
  return context;
};
