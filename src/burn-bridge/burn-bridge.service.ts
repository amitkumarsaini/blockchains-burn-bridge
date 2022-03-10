import { Injectable } from '@nestjs/common';

import * as BridgeConfig from '../config/bridge-config.json';
import * as BridgeContractABI from '../config/bridge-contract-ABI.json';
import { BaseContract } from '../base/base.contract';

@Injectable()
export class BurnBridgeService extends BaseContract {
  constructor() {
    const web3Provider = BridgeConfig.chain2.rpcEndpoint;
    const contractAddress = BridgeConfig.chain2.contractAddress;
    const contractABI = BridgeContractABI;
    super(web3Provider, contractAddress, contractABI);
  }
}
