import { AbstractEntity } from '../base/base.entity';
export declare class Batches extends AbstractEntity<Batches> {
    keyName: string;
    chainId: string;
    lastBlockNumber: number;
    createdAt: Date;
    updatedAt: Date;
}
