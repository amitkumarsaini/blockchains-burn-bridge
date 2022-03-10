import { BeforeApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BatchService } from './batch/batch.service';
import { BridgeEventService } from './bridge-event/bridge-event.service';
import { EthereumBridgeService } from './ethereum-bridge/ethereum-bridge.service';
import { BurnBridgeService } from './burn-bridge/burn-bridge.service';
export declare class AppService implements BeforeApplicationShutdown {
    private readonly configService;
    private readonly batchService;
    private readonly ethereumBridgeService;
    private readonly burnBridgeService;
    private readonly bridgeEventService;
    private eventEmitter;
    private fetchingEthereumEvents;
    private fetchingBurnEvents;
    private triggeringBridgeEvents;
    private logger;
    private serverIsTerminating;
    constructor(configService: ConfigService, batchService: BatchService, ethereumBridgeService: EthereumBridgeService, burnBridgeService: BurnBridgeService, bridgeEventService: BridgeEventService);
    beforeApplicationShutdown(signal: string): Promise<void>;
    monitorEthereumEvents(): Promise<void>;
    monitorBurnEvents(): Promise<void>;
    triggerBridgeEvent(): Promise<void>;
}
