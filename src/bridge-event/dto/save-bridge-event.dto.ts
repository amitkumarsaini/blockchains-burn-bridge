export class SaveBridgeEventDto {
  sourceChain: string;
  sourceToken: string;
  targetTx: string;
  targetChain: string;
  targetToken: string;
  fromAddress: string;
  toAddress: string;
  amount: number;
  status: number;
  retryCount?: number;
}
