export interface IEthParams {
    contractAddress?: string;
}
export interface IMethodsParams extends IEthParams {
    params: any[];
    method: string;
}
export interface ISendMethodsParams extends IMethodsParams {
    privateKey: string;
    nonce?: number;
}
export interface WaitTxOptions {
    intervalTime?: number;
    blocksToWait?: number;
    maxIntervalTime?: number;
}
export declare const checkTxIsSuccessful: (receipt: any) => boolean;
