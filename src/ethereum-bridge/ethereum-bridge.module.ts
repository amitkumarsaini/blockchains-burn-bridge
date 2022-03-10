import { Module } from '@nestjs/common';

import { EthereumBridgeService } from './ethereum-bridge.service';

@Module({
  exports: [EthereumBridgeService],
  providers: [EthereumBridgeService],
})
export class EthereumBridgeModule {}
