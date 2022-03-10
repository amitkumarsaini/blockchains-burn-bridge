import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { LessThan, Repository } from 'typeorm';

import { BridgeEvent } from './bridge-event.entity';
import { CreateBridgeEventDto } from './dto/create-bridge-event.dto';

@Injectable()
export class BridgeEventService {
  private logger = new Logger(BridgeEventService.name);

  constructor(
    @InjectRepository(BridgeEvent)
    private readonly bridgeEventRepo: Repository<BridgeEvent>,
  ) {}

  async save(bridgeEventDto: CreateBridgeEventDto) {
    const newEvent = new BridgeEvent({ ...bridgeEventDto });
    const result = await this.bridgeEventRepo.save(newEvent);
    this.logger.log(
      `Created or save the 'Bridge' event with source_tx: ${newEvent.sourceTx}`,
    );
    return result;
  }

  async getEventsToTrigger() {
    const eventsToTrigger = await this.bridgeEventRepo.find({
      where: { status: 0, retryCount: LessThan(10) },
    });

    return eventsToTrigger;
  }
}
