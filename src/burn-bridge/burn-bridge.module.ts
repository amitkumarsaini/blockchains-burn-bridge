import { Module } from '@nestjs/common';
import { BurnBridgeService } from './burn-bridge.service';

@Module({
  exports: [BurnBridgeService],
  providers: [BurnBridgeService],
})
export class BurnBridgeModule {}
