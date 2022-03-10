import { ISendMethodsParams, WaitTxOptions } from '../types/custom-web3-utils';
import { TransactionReceipt } from 'web3-core';
export declare abstract class BaseContract {
    private web3;
    private bridgeContractAddress;
    private bridgeContract;
    constructor(web3Provider: string, contractAddress: string, contractABI: any);
    getEvents(eventName: string, lastBlockNumber: number): Promise<import("web3-eth-contract").EventData[]>;
    private sendTx;
    sendMethods(body: ISendMethodsParams): Promise<string>;
    waitTransaction: (txnHash: string | string[], startTime: number, options?: WaitTxOptions) => Promise<TransactionReceipt | TransactionReceipt[]>;
}
