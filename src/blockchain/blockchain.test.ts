import { describe, it, expect, beforeEach } from 'vitest';
import { Blockchain } from './blockchain';
import { sha256, computeMerkleRoot } from './crypto';

describe('Pravasi Matdan Blockchain Engine Tests', () => {
  let blockchain: Blockchain;

  beforeEach(async () => {
    blockchain = new Blockchain();
    await blockchain.initialize();
  });

  it('1. Hashing and Merkle Root calculation works correctly', async () => {
    const hash1 = await sha256('Test Transaction 1');
    const hash2 = await sha256('Test Transaction 2');
    expect(hash1).toBeDefined();
    expect(hash1.length).toBe(64); // SHA-256 hex string

    // Merkle root calculation
    const root = await computeMerkleRoot([hash1, hash2]);
    expect(root).toBeDefined();
    expect(root.length).toBe(64);

    // Verify determinism
    const root2 = await computeMerkleRoot([hash1, hash2]);
    expect(root).toBe(root2);
  });

  it('2. Chain integrity validation succeeds on genuine chain', async () => {
    const report1 = await blockchain.verifyChain();
    expect(report1.isValid).toBe(true);
    expect(report1.totalBlocks).toBe(1); // Genesis block

    // Add voter registered transaction
    await blockchain.addTransaction('VOTER_REGISTERED', 'ELECTION_OFFICER', {
      voterIdHash: 'v_hash_001',
      voterPublicKey: 'PUB_KEY_001',
      constituencyId: 'pc-01',
      countryCode: 'AE',
      registrationRef: 'APP-001',
    });

    const report2 = await blockchain.verifyChain();
    expect(report2.isValid).toBe(true);
    expect(report2.totalBlocks).toBe(2);
  });

  it('3. Double-voting is strictly rejected by the Smart Contract', async () => {
    // Open voting phase
    blockchain.getContract().setPhase('VOTING');

    const tokenHash = 'secret_blind_token_hash_7788';

    // First vote - should succeed
    const tx1 = await blockchain.addTransaction('VOTE_CAST', tokenHash, {
      tokenHash,
      encryptedBallot: 'ENC:test_encrypted_ballot_modi',
      constituencyId: 'pc-01',
      signature: 'SIG_001',
    });
    expect(tx1).toBeDefined();
    expect(tx1.type).toBe('VOTE_CAST');

    // Second vote with the SAME token - MUST be rejected
    await expect(
      blockchain.addTransaction('VOTE_CAST', tokenHash, {
        tokenHash,
        encryptedBallot: 'ENC:test_encrypted_ballot_rai',
        constituencyId: 'pc-01',
        signature: 'SIG_002',
      })
    ).rejects.toThrow(/Double-voting detected/);
  });

  it('4. Tamper test visibly breaks chain integrity and restore recovers it', async () => {
    // Add two blocks
    blockchain.getContract().setPhase('VOTING');
    await blockchain.addTransaction('VOTE_CAST', 'tok_1', {
      tokenHash: 'tok_1',
      encryptedBallot: 'ENC:candidate_01',
      constituencyId: 'pc-01',
    });

    await blockchain.addTransaction('VOTE_CAST', 'tok_2', {
      tokenHash: 'tok_2',
      encryptedBallot: 'ENC:candidate_02',
      constituencyId: 'pc-01',
    });

    const genuineReport = await blockchain.verifyChain();
    expect(genuineReport.isValid).toBe(true);

    // Tamper Block #1 data secretly
    const tampered = blockchain.tamperBlock(1, 'HACKED BALLOT DATA');
    expect(tampered).toBe(true);

    // Validation report MUST fail
    const tamperedReport = await blockchain.verifyChain();
    expect(tamperedReport.isValid).toBe(false);
    expect(tamperedReport.tamperedBlockIndex).toBe(1);

    // Restore genuine chain
    const restored = blockchain.restoreChain();
    expect(restored).toBe(true);

    const restoredReport = await blockchain.verifyChain();
    expect(restoredReport.isValid).toBe(true);
  });
});
