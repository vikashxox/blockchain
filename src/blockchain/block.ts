import { sha256, computeMerkleRoot } from './crypto';
import { Transaction, calculateTransactionHash } from './transaction';

export const VALIDATOR_NODES = ['Delhi-Node (Consensus Alpha)', 'Dubai-Node (Consensus Beta)', 'London-Node (Consensus Gamma)'] as const;
export type ValidatorNode = (typeof VALIDATOR_NODES)[number];

export interface Block {
  index: number;
  timestamp: number;
  previousHash: string;
  merkleRoot: string;
  transactions: Transaction[];
  validator: ValidatorNode;
  nonce: number;
  difficulty: number;
  hash: string;
}

/**
 * Calculates SHA-256 hash of block header
 */
export async function calculateBlockHash(
  index: number,
  previousHash: string,
  timestamp: number,
  merkleRoot: string,
  validator: string,
  nonce: number,
  difficulty: number
): Promise<string> {
  const header = `${index}:${previousHash}:${timestamp}:${merkleRoot}:${validator}:${nonce}:${difficulty}`;
  return await sha256(header);
}

/**
 * Creates Genesis Block (Block #0)
 */
export async function createGenesisBlock(): Promise<Block> {
  const index = 0;
  const timestamp = 1714521600000; // Fixed deterministic timestamp for genesis
  const previousHash = '0000000000000000000000000000000000000000000000000000000000000000';
  const genesisPayload = {
    action: 'GENESIS_BLOCK_INITIALIZED',
    details: 'Pravasi Matdan Sovereign NRI Voting Ledger initialized by Election Authority Consensus',
    network: 'Pravasi-Net-Main-Sim',
    protocolVersion: '1.0.0-PoA-P256',
  };
  const genesisTxId = await calculateTransactionHash('ADMIN_AUDIT', timestamp, 'GENESIS_AUTHORITY', genesisPayload);
  const transactions: Transaction[] = [
    {
      id: genesisTxId,
      type: 'ADMIN_AUDIT',
      timestamp,
      sender: 'GENESIS_AUTHORITY',
      payload: genesisPayload,
    },
  ];
  const merkleRoot = await computeMerkleRoot(transactions.map(t => t.id));
  const validator: ValidatorNode = VALIDATOR_NODES[0];
  const nonce = 108;
  const difficulty = 2;
  const hash = await calculateBlockHash(index, previousHash, timestamp, merkleRoot, validator, nonce, difficulty);

  return {
    index,
    timestamp,
    previousHash,
    merkleRoot,
    transactions,
    validator,
    nonce,
    difficulty,
    hash,
  };
}

/**
 * Mines a new block with PoA validator attribution and lightweight PoW puzzle
 */
export async function mineBlock(
  index: number,
  previousHash: string,
  transactions: Transaction[],
  validator: ValidatorNode,
  difficulty: number = 2
): Promise<Block> {
  const timestamp = Date.now();
  const txHashes = transactions.map(t => t.id);
  const merkleRoot = await computeMerkleRoot(txHashes);

  let nonce = 0;
  let hash = '';
  const prefix = '0'.repeat(difficulty);

  // Mining loop with low difficulty for responsive visual effect
  while (true) {
    hash = await calculateBlockHash(index, previousHash, timestamp, merkleRoot, validator, nonce, difficulty);
    if (hash.startsWith(prefix)) {
      break;
    }
    nonce++;
    // Failsafe safety break after 50,000 iterations to never freeze UI
    if (nonce > 50000) {
      break;
    }
  }

  return {
    index,
    timestamp,
    previousHash,
    merkleRoot,
    transactions,
    validator,
    nonce,
    difficulty,
    hash,
  };
}

/**
 * Verifies single block integrity against header and transactions
 */
export async function verifyBlock(block: Block, previousBlock?: Block): Promise<{ valid: boolean; reason?: string }> {
  // Check index sequence
  if (previousBlock && block.index !== previousBlock.index + 1) {
    return { valid: false, reason: `Block #${block.index} index does not follow #${previousBlock.index}` };
  }

  // Check previousHash link
  if (previousBlock && block.previousHash !== previousBlock.hash) {
    return {
      valid: false,
      reason: `Block #${block.index} previousHash (${block.previousHash.slice(0, 8)}...) does not match previous block hash (${previousBlock.hash.slice(0, 8)}...)`,
    };
  }

  // Check individual transactions integrity
  for (const tx of block.transactions) {
    const calculatedTxId = await calculateTransactionHash(tx.type, tx.timestamp, tx.sender, tx.payload);
    if (tx.id !== calculatedTxId) {
      return {
        valid: false,
        reason: `Block #${block.index} contains tampered transaction ${tx.id.slice(0, 8)}... (Payload content altered)`,
      };
    }
  }

  // Check Merkle Root
  const calculatedMerkleRoot = await computeMerkleRoot(block.transactions.map(t => t.id));
  if (block.merkleRoot !== calculatedMerkleRoot) {
    return { valid: false, reason: `Block #${block.index} Merkle root mismatch` };
  }

  // Check Block Hash
  const calculatedHash = await calculateBlockHash(
    block.index,
    block.previousHash,
    block.timestamp,
    block.merkleRoot,
    block.validator,
    block.nonce,
    block.difficulty
  );

  if (block.hash !== calculatedHash) {
    return {
      valid: false,
      reason: `Block #${block.index} hash mismatch. Computed: ${calculatedHash.slice(0, 10)}... Recorded: ${block.hash.slice(0, 10)}...`,
    };
  }

  return { valid: true };
}
