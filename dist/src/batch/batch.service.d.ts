import { Repository } from 'typeorm';
import { Batches } from './batch.entity';
export declare class BatchService {
    private readonly batchRepo;
    private logger;
    constructor(batchRepo: Repository<Batches>);
    updateBlockNumber(keyName: string, chainId: string, lastBlockNumber: number): Promise<Batches>;
    getLastBlockNumber(keyName: string, chainId: string): Promise<number>;
}
