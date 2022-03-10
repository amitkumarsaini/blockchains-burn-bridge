import { Repository } from 'typeorm';
import { BridgeEvent } from './bridge-event.entity';
import { CreateBridgeEventDto } from './dto/create-bridge-event.dto';
export declare class BridgeEventService {
    private readonly bridgeEventRepo;
    private logger;
    constructor(bridgeEventRepo: Repository<BridgeEvent>);
    save(bridgeEventDto: CreateBridgeEventDto): Promise<BridgeEvent>;
    getEventsToTrigger(): Promise<BridgeEvent[]>;
}
