import { Injectable } from '@nestjs/common';

import * as BridgeConfig from '../config/bridge-config.json';
import * as BridgeContractABI from '../config/bridge-contract-ABI.json';
import { BaseContract } from '../base/base.contract';

@Injectable()
export class EthereumBridgeService extends BaseContract {
  constructor() {
    const web3Provider = BridgeConfig.chain1.rpcEndpoint;
    const contractAddress = BridgeConfig.chain1.contractAddress;
    const contractABI = BridgeContractABI;
    super(web3Provider, contractAddress, contractABI);
  }
}
