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

export const checkTxIsSuccessful = (receipt: any): boolean => {
  if ((receipt && receipt.status == '0x1') || receipt.status == true) {
    return true;
  } else {
    return false;
  }
};
