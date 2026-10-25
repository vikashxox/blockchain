import { Block, createGenesisBlock, mineBlock, verifyBlock, VALIDATOR_NODES, ValidatorNode } from './block';
import { Transaction, TransactionType, createTransaction, BaseTransactionPayload } from './transaction';
import { VotingSmartContract, ElectionPhase } from '../contracts/votingContract';

export interface ChainValidationReport {
  isValid: boolean;
  tamperedBlockIndex?: number;
  reason?: string;
  totalBlocks: number;
  totalTransactions: number;
}

export type BlockchainListener = () => void;

export class Blockchain {
  private chain: Block[] = [];
  private mempool: Transaction[] = [];
  private contract: VotingSmartContract;
  private currentValidatorIndex: number = 0;
  private listeners: Set<BlockchainListener> = new Set();
  private backupChainForTamper: Block[] | null = null;
  private isTampered: boolean = false;
  private isAutoMining: boolean = false;

  constructor() {
    this.contract = new VotingSmartContract('REGISTRATION');
  }

  public async initialize(): Promise<void> {
    if (this.chain.length === 0) {
      const genesis = await createGenesisBlock();
      this.chain = [genesis];
      this.contract.applyTransaction(genesis.transactions[0]);
    }
  }

  public getChain(): Block[] {
    return this.chain;
  }

  public getMempool(): Transaction[] {
    return this.mempool;
  }

  public getContract(): VotingSmartContract {
    return this.contract;
  }

  public isChainTampered(): boolean {
    return this.isTampered;
  }

  public subscribe(listener: BlockchainListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  private notifyListeners(): void {
    for (const listener of this.listeners) {
      listener();
    }
  }

  /**
   * Adds transaction to mempool after smart contract validation
   */
  public async addTransaction(
    type: TransactionType,
    sender: string,
    payload: BaseTransactionPayload,
    signature?: string
  ): Promise<Transaction> {
    const tx = await createTransaction(type, sender, payload, signature);

    const validation = this.contract.validateTransaction(tx);
    if (!validation.valid) {
      throw new Error(validation.error || 'Transaction rejected by smart contract');
    }

    this.mempool.push(tx);
    this.notifyListeners();

    // Auto-mine pending transactions to maintain smooth interactive demo
    await this.minePendingTransactions();

    return tx;
  }

  /**
   * Mines all pending transactions into a new Block using rotating PoA validator
   */
  public async minePendingTransactions(): Promise<Block | null> {
    if (this.mempool.length === 0 || this.isAutoMining) {
      return null;
    }

    try {
      this.isAutoMining = true;
      const transactionsToMine = [...this.mempool];
      this.mempool = [];

      const latestBlock = this.getLatestBlock();
      const nextIndex = latestBlock.index + 1;
      const validator: ValidatorNode = VALIDATOR_NODES[this.currentValidatorIndex % VALIDATOR_NODES.length];
      this.currentValidatorIndex++;

      const newBlock = await mineBlock(nextIndex, latestBlock.hash, transactionsToMine, validator, 2);

      // Apply confirmed transactions to smart contract state
      for (const tx of newBlock.transactions) {
        this.contract.applyTransaction(tx);
      }

      this.chain.push(newBlock);
      this.notifyListeners();
      return newBlock;
    } finally {
      this.isAutoMining = false;
    }
  }

  public getLatestBlock(): Block {
    return this.chain[this.chain.length - 1];
  }

  public getBlockByIndex(index: number): Block | undefined {
    return this.chain.find(b => b.index === index);
  }

  public getBlockByHash(hash: string): Block | undefined {
    return this.chain.find(b => b.hash.toLowerCase() === hash.toLowerCase());
  }

  public findTransaction(txId: string): { transaction: Transaction; block: Block; confirmations: number } | null {
    for (let i = 0; i < this.chain.length; i++) {
      const block = this.chain[i];
      const tx = block.transactions.find(t => t.id.toLowerCase() === txId.toLowerCase());
      if (tx) {
        return {
          transaction: tx,
          block,
          confirmations: this.chain.length - i,
        };
      }
    }
    return null;
  }

  public getAllTransactions(): { transaction: Transaction; blockIndex: number; blockHash: string }[] {
    const list: { transaction: Transaction; blockIndex: number; blockHash: string }[] = [];
    for (const b of this.chain) {
      for (const tx of b.transactions) {
        list.push({ transaction: tx, blockIndex: b.index, blockHash: b.hash });
      }
    }
    return list;
  }

  /**
   * Thorough verification of the entire blockchain
   */
  public async verifyChain(): Promise<ChainValidationReport> {
    let totalTransactions = 0;

    for (let i = 0; i < this.chain.length; i++) {
      const currentBlock = this.chain[i];
      totalTransactions += currentBlock.transactions.length;

      const previousBlock = i > 0 ? this.chain[i - 1] : undefined;
      const verification = await verifyBlock(currentBlock, previousBlock);

      if (!verification.valid) {
        return {
          isValid: false,
          tamperedBlockIndex: currentBlock.index,
          reason: verification.reason,
          totalBlocks: this.chain.length,
          totalTransactions,
        };
      }
    }

    return {
      isValid: true,
      totalBlocks: this.chain.length,
      totalTransactions,
    };
  }

  /**
   * Presentation Feature: Tamper a block to demonstrate chain break
   */
  public tamperBlock(blockIndex: number, fakePayloadDetails?: string): boolean {
    const block = this.chain.find(b => b.index === blockIndex);
    if (!block) return false;

    // Backup chain if not already backed up
    if (!this.backupChainForTamper) {
      this.backupChainForTamper = JSON.parse(JSON.stringify(this.chain));
    }

    if (block.transactions.length > 0) {
      // Modify transaction payload secretly without recomputing hash
      block.transactions[0].payload = {
        ...block.transactions[0].payload,
        TAMPERED_FLAG: true,
        details: fakePayloadDetails || '[TAMPERED] Vote switched by malicious actor at node level',
      };
    } else {
      block.nonce = block.nonce + 99999;
    }

    this.isTampered = true;
    this.notifyListeners();
    return true;
  }

  /**
   * Presentation Feature: Restore authentic blockchain after tamper demo
   */
  public restoreChain(): boolean {
    if (!this.backupChainForTamper) return false;

    this.chain = JSON.parse(JSON.stringify(this.backupChainForTamper));
    this.backupChainForTamper = null;
    this.isTampered = false;

    // Rebuild contract state from restored transactions
    const allTxs = this.getAllTransactions().map(item => item.transaction);
    this.contract.rebuildStateFromHistory(allTxs);

    this.notifyListeners();
    return true;
  }

  /**
   * Serialization for localStorage persistence
   */
  public toJSON(): string {
    return JSON.stringify({
      chain: this.chain,
      mempool: this.mempool,
      phase: this.contract.getPhase(),
      isTampered: this.isTampered,
    });
  }

  public fromJSON(dataStr: string): void {
    try {
      const data = JSON.parse(dataStr);
      if (Array.isArray(data.chain) && data.chain.length > 0) {
        this.chain = data.chain;
        this.mempool = Array.isArray(data.mempool) ? data.mempool : [];
        const phase: ElectionPhase = data.phase || 'REGISTRATION';
        this.contract.setPhase(phase);
        this.isTampered = !!data.isTampered;

        // Rebuild state
        const allTxs = this.getAllTransactions().map(item => item.transaction);
        this.contract.rebuildStateFromHistory(allTxs);
        this.notifyListeners();
      }
    } catch (e) {
      console.error('Failed to parse blockchain JSON:', e);
    }
  }
}
