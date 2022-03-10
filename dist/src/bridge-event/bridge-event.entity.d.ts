import { AbstractEntity } from '../base/base.entity';
export declare class BridgeEvent extends AbstractEntity<BridgeEvent> {
    sourceTx: string;
    sourceChain: string;
    sourceToken: string;
    targetTx: string;
    targetChain: string;
    targetToken: string;
    fromAddress: string;
    toAddress: string;
    amount: number;
    status: number;
    retryCount: number;
    updatedAt: Date;
    createdAt: Date;
    checkPKValue(): void;
}
