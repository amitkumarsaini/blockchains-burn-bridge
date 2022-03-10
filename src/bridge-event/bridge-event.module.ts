import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { BridgeEvent } from './bridge-event.entity';
import { BridgeEventService } from './bridge-event.service';

@Module({
  imports: [TypeOrmModule.forFeature([BridgeEvent])],
  providers: [BridgeEventService],
  exports: [BridgeEventService],
})
export class BridgeEventsModule {}
