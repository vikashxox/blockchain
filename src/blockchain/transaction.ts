import { sha256 } from './crypto';

export type TransactionType =
  | 'VOTER_REGISTERED'
  | 'ELECTION_CREATED'
  | 'PHASE_CHANGED'
  | 'TOKEN_ISSUED'
  | 'VOTE_CAST'
  | 'RESULT_PUBLISHED'
  | 'ADMIN_AUDIT';

export interface BaseTransactionPayload {
  [key: string]: unknown;
}

export interface VoterRegisteredPayload extends BaseTransactionPayload {
  voterIdHash: string; // SHA-256(passportNumber + salt)
  voterPublicKey: string;
  constituencyId: string;
  countryCode: string;
  registrationRef: string;
}

export interface ElectionCreatedPayload extends BaseTransactionPayload {
  electionId: string;
  title: string;
  year: number;
  electionPublicKey: string;
}

export interface PhaseChangedPayload extends BaseTransactionPayload {
  electionId: string;
  previousPhase: string;
  newPhase: string;
  officerId: string;
  timestamp: number;
}

export interface TokenIssuedPayload extends BaseTransactionPayload {
  tokenHash: string; // Anonymous token commitment
  constituencyId: string;
  issueTimestamp: number;
}

export interface VoteCastPayload extends BaseTransactionPayload {
  tokenHash: string; // Used to prevent double-voting
  encryptedBallot: string; // Encrypted with election public key
  constituencyId: string;
  signature: string; // Signed by anonymous voter key
}

export interface ResultPublishedPayload extends BaseTransactionPayload {
  electionId: string;
  totalVotesDecrypted: number;
  constituencyTallies: Record<string, Record<string, number>>; // constituencyId -> candidateId -> votes
  electionPrivateKeyReleased: string;
}

export interface AdminAuditPayload extends BaseTransactionPayload {
  officerId: string;
  action: string;
  details: string;
  targetId?: string;
}

export interface Transaction {
  id: string; // SHA-256 hash of tx content
  type: TransactionType;
  timestamp: number;
  payload: BaseTransactionPayload;
  sender: string; // "SYSTEM", "ELECTION_OFFICER", or Voter Public Key Hash / Token Hash
  signature?: string;
}

/**
 * Computes canonical hash for a transaction
 */
export async function calculateTransactionHash(
  type: TransactionType,
  timestamp: number,
  sender: string,
  payload: BaseTransactionPayload
): Promise<string> {
  const serialized = JSON.stringify({
    type,
    timestamp,
    sender,
    payload,
  });
  return await sha256(serialized);
}

/**
 * Creates and hashes a new transaction
 */
export async function createTransaction(
  type: TransactionType,
  sender: string,
  payload: BaseTransactionPayload,
  signature?: string
): Promise<Transaction> {
  const timestamp = Date.now();
  const id = await calculateTransactionHash(type, timestamp, sender, payload);
  return {
    id,
    type,
    timestamp,
    sender,
    payload,
    signature,
  };
}
