import { Transaction, VoteCastPayload, VoterRegisteredPayload, TokenIssuedPayload } from '../blockchain/transaction';
import { decryptBallot } from '../blockchain/crypto';

export type ElectionPhase = 'REGISTRATION' | 'VOTING' | 'COUNTING' | 'RESULTS_DECLARED';

export interface SmartContractState {
  currentPhase: ElectionPhase;
  registeredVoterHashes: Set<string>; // voterIdHash
  issuedTokenHashes: Set<string>; // tokenHash
  spentTokenHashes: Set<string>; // tokenHash already voted
  voteReceipts: Map<string, { blockIndex: number; timestamp: number; constituencyId: string }>; // txId -> info
  ballotsByConstituency: Map<string, string[]>; // constituencyId -> encryptedBallots[]
}

export interface ContractValidationResult {
  valid: boolean;
  error?: string;
}

export class VotingSmartContract {
  private phase: ElectionPhase = 'REGISTRATION';
  private registeredVoters = new Set<string>(); // voterIdHash
  private issuedTokens = new Set<string>(); // tokenHash
  private spentTokens = new Set<string>(); // tokenHash that already voted
  private electionPublicKey: string = 'PUB_KEY_DEMO_2026_PRAVASI';
  private electionPrivateKey: string = 'PRIV_KEY_DEMO_RELEASED_2026';

  constructor(initialPhase: ElectionPhase = 'REGISTRATION') {
    this.phase = initialPhase;
  }

  public getPhase(): ElectionPhase {
    return this.phase;
  }

  public setPhase(newPhase: ElectionPhase): void {
    this.phase = newPhase;
  }

  public getElectionPublicKey(): string {
    return this.electionPublicKey;
  }

  public getElectionPrivateKey(): string {
    return this.electionPrivateKey;
  }

  /**
   * Validates a transaction before admission to mempool / block
   */
  public validateTransaction(tx: Transaction): ContractValidationResult {
    switch (tx.type) {
      case 'VOTER_REGISTERED': {
        const payload = tx.payload as VoterRegisteredPayload;
        if (!payload.voterIdHash || !payload.constituencyId) {
          return { valid: false, error: 'Malformed VoterRegistered payload: Missing ID hash or constituency' };
        }
        if (this.registeredVoters.has(payload.voterIdHash)) {
          return { valid: false, error: 'Voter is already registered on-chain' };
        }
        return { valid: true };
      }

      case 'TOKEN_ISSUED': {
        const payload = tx.payload as TokenIssuedPayload;
        if (!payload.tokenHash) {
          return { valid: false, error: 'Malformed TokenIssued payload: Missing token hash' };
        }
        if (this.issuedTokens.has(payload.tokenHash)) {
          return { valid: false, error: 'Token has already been issued' };
        }
        return { valid: true };
      }

      case 'VOTE_CAST': {
        const payload = tx.payload as VoteCastPayload;
        // Phase check
        if (this.phase !== 'VOTING') {
          return {
            valid: false,
            error: `Voting is not open. Current election phase is "${this.phase}". Votes can only be cast during the "VOTING" phase.`,
          };
        }
        // Double voting prevention
        if (this.spentTokens.has(payload.tokenHash)) {
          return {
            valid: false,
            error: 'Double-voting detected! This anonymous voter token has ALREADY cast a ballot in this election. Second vote rejected by smart contract.',
          };
        }
        if (!payload.encryptedBallot || !payload.constituencyId) {
          return { valid: false, error: 'Malformed VoteCast payload: Missing encrypted ballot or constituency.' };
        }
        return { valid: true };
      }

      case 'PHASE_CHANGED':
      case 'ELECTION_CREATED':
      case 'RESULT_PUBLISHED':
      case 'ADMIN_AUDIT':
        return { valid: true };

      default:
        return { valid: false, error: `Unknown transaction type: ${(tx as Transaction).type}` };
    }
  }

  /**
   * Applies confirmed transaction to contract state
   */
  public applyTransaction(tx: Transaction): void {
    switch (tx.type) {
      case 'VOTER_REGISTERED': {
        const payload = tx.payload as VoterRegisteredPayload;
        this.registeredVoters.add(payload.voterIdHash);
        break;
      }
      case 'TOKEN_ISSUED': {
        const payload = tx.payload as TokenIssuedPayload;
        this.issuedTokens.add(payload.tokenHash);
        break;
      }
      case 'VOTE_CAST': {
        const payload = tx.payload as VoteCastPayload;
        this.spentTokens.add(payload.tokenHash);
        break;
      }
      case 'PHASE_CHANGED': {
        const payload = tx.payload as { newPhase: ElectionPhase };
        if (payload.newPhase) {
          this.phase = payload.newPhase;
        }
        break;
      }
    }
  }

  /**
   * Rebuilds state from full blockchain history
   */
  public rebuildStateFromHistory(transactions: Transaction[]): void {
    this.registeredVoters.clear();
    this.issuedTokens.clear();
    this.spentTokens.clear();

    for (const tx of transactions) {
      this.applyTransaction(tx);
    }
  }

  public isTokenSpent(tokenHash: string): boolean {
    return this.spentTokens.has(tokenHash);
  }

  public isVoterRegistered(voterIdHash: string): boolean {
    return this.registeredVoters.has(voterIdHash);
  }

  /**
   * Decrypts and tallies votes when phase is COUNTING or RESULTS_DECLARED
   */
  public countVotes(voteTransactions: Transaction[]): Record<string, Record<string, number>> {
    const results: Record<string, Record<string, number>> = {};

    for (const tx of voteTransactions) {
      if (tx.type === 'VOTE_CAST') {
        const payload = tx.payload as VoteCastPayload;
        const decrypted = decryptBallot(payload.encryptedBallot, this.electionPrivateKey);
        if (decrypted) {
          const { constituencyId, candidateId } = decrypted;
          if (!results[constituencyId]) {
            results[constituencyId] = {};
          }
          results[constituencyId][candidateId] = (results[constituencyId][candidateId] || 0) + 1;
        }
      }
    }

    return results;
  }
}
