"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var AppService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppService = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const events_1 = require("events");
const batch_service_1 = require("./batch/batch.service");
const batch_types_1 = require("./batch/batch.types");
const bridge_event_service_1 = require("./bridge-event/bridge-event.service");
const ethereum_bridge_service_1 = require("./ethereum-bridge/ethereum-bridge.service");
const burn_bridge_service_1 = require("./burn-bridge/burn-bridge.service");
const BridgeConfig = require("./config/bridge-config.json");
const custom_web3_utils_1 = require("./types/custom-web3-utils");
const monitorIntervalTime = BridgeConfig.interval || 30;
let AppService = AppService_1 = class AppService {
    constructor(configService, batchService, ethereumBridgeService, burnBridgeService, bridgeEventService) {
        this.configService = configService;
        this.batchService = batchService;
        this.ethereumBridgeService = ethereumBridgeService;
        this.burnBridgeService = burnBridgeService;
        this.bridgeEventService = bridgeEventService;
        this.eventEmitter = new events_1.EventEmitter();
        this.logger = new common_1.Logger(AppService_1.name);
        this.serverIsTerminating = false;
    }
    async beforeApplicationShutdown(signal) {
        this.logger.log(`Received signal : ${signal}`);
        this.serverIsTerminating = true;
        if (this.fetchingEthereumEvents || this.fetchingBurnEvents) {
            this.logger.log(`Waiting for event processing to be done...`);
            await events_1.once(this.eventEmitter, 'fetching done');
            this.logger.log(`Done, gracefully shutdown server`);
        }
    }
    async monitorEthereumEvents() {
        this.logger.log(`monitorEthereumEvents is running..`);
        if (this.fetchingEthereumEvents || this.serverIsTerminating) {
            return;
        }
        try {
            this.fetchingEthereumEvents = true;
            let lastBlockNumber = await this.batchService.getLastBlockNumber(batch_types_1.BatchEventName.BRIDGE_EVENT, batch_types_1.BatchChainId.ETHEREUM);
            lastBlockNumber = lastBlockNumber > 0 ? lastBlockNumber : Number(process.env.CHAIN1_START_BLOCK_NUMBER);
            let newLastBlockNumber = lastBlockNumber;
            const fetchedEvents = await this.ethereumBridgeService.getEvents(batch_types_1.BatchEventName.BRIDGE_EVENT, lastBlockNumber);
            for (const fetchedEvent of fetchedEvents) {
                const { transactionHash, blockNumber, returnValues: { _amount: amount, _from: from, _to: to, _token1: token1, _token2: token2, }, } = fetchedEvent;
                if (!transactionHash) {
                }
                const newEventData = {
                    sourceTx: transactionHash,
                    sourceChain: batch_types_1.BatchChainId.ETHEREUM,
                    sourceToken: token1 || '',
                    targetTx: null,
                    targetChain: batch_types_1.BatchChainId.BURN,
                    targetToken: token2 || '',
                    fromAddress: from || '',
                    toAddress: to || '',
                    status: 0,
                    amount,
                };
                await this.bridgeEventService.save(newEventData);
                newLastBlockNumber =
                    newLastBlockNumber < blockNumber ? blockNumber : newLastBlockNumber;
            }
            if (newLastBlockNumber > lastBlockNumber) {
                await this.batchService.updateBlockNumber(batch_types_1.BatchEventName.BRIDGE_EVENT, batch_types_1.BatchChainId.ETHEREUM, newLastBlockNumber);
            }
            this.fetchingEthereumEvents = false;
        }
        catch (error) {
            this.fetchingEthereumEvents = false;
            this.logger.error(`monitorEthereumEvents error ${error}`);
        }
    }
    async monitorBurnEvents() {
        this.logger.log(`monitorBurnEvents is running..`);
        if (this.fetchingBurnEvents || this.serverIsTerminating) {
            return;
        }
        try {
            this.fetchingBurnEvents = true;
            let lastBlockNumber = await this.batchService.getLastBlockNumber(batch_types_1.BatchEventName.BRIDGE_EVENT, batch_types_1.BatchChainId.BURN);
            lastBlockNumber = lastBlockNumber > 0 ? lastBlockNumber : Number(process.env.CHAIN2_START_BLOCK_NUMBER);
            let newLastBlockNumber = lastBlockNumber;
            const fetchedEvents = await this.burnBridgeService.getEvents(batch_types_1.BatchEventName.BRIDGE_EVENT, lastBlockNumber);
            for (const fetchedEvent of fetchedEvents) {
                const { transactionHash, blockNumber, returnValues: { _amount: amount, _from: from, _to: to, _token1: token1, _token2: token2, }, } = fetchedEvent;
                if (!transactionHash) {
                }
                const newEventData = {
                    sourceTx: transactionHash,
                    sourceChain: batch_types_1.BatchChainId.BURN,
                    sourceToken: token1 || '',
                    targetTx: null,
                    targetChain: batch_types_1.BatchChainId.ETHEREUM,
                    targetToken: token2 || '',
                    fromAddress: from || '',
                    toAddress: to || '',
                    status: 0,
                    amount,
                };
                await this.bridgeEventService.save(newEventData);
                newLastBlockNumber =
                    newLastBlockNumber < blockNumber ? blockNumber : newLastBlockNumber;
            }
            if (newLastBlockNumber > lastBlockNumber) {
                await this.batchService.updateBlockNumber(batch_types_1.BatchEventName.BRIDGE_EVENT, batch_types_1.BatchChainId.BURN, newLastBlockNumber);
            }
            this.fetchingBurnEvents = false;
        }
        catch (error) {
            this.fetchingBurnEvents = false;
            this.logger.error(`monitorBurnEvents error ${error}`);
        }
    }
    async triggerBridgeEvent() {
        try {
            if (this.triggeringBridgeEvents) {
                return;
            }
            this.triggeringBridgeEvents = true;
            this.logger.log(`triggerBridgeEvent is running..`);
            const eventsToTrigger = await this.bridgeEventService.getEventsToTrigger();
            for (const eventToTrigger of eventsToTrigger) {
                try {
                    const { sourceTx, targetChain, targetToken, toAddress, amount } = eventToTrigger;
                    const bridgeOwnerPK = this.configService.get('BRIDGE_OWNER_PRIVATE_KEY');
                    const methodBody = {
                        privateKey: bridgeOwnerPK,
                        method: 'trigger',
                        params: [targetToken, toAddress, amount],
                    };
                    const maxIntervalTime = process.env.MAX_TX_INTERVAL_TIME
                        ? Number(process.env.MAX_TX_INTERVAL_TIME)
                        : 60000;
                    const intervalTime = process.env.WAIT_TX_INTERVAL
                        ? Number(process.env.WAIT_TX_INTERVAL)
                        : 1000;
                    this.logger.log(`[${targetChain}] triggering with sourceTx: ${sourceTx}`);
                    if (targetChain === batch_types_1.BatchChainId.ETHEREUM) {
                        const txHash = await this.ethereumBridgeService.sendMethods(methodBody);
                        const startTime = Date.now();
                        const txReceipt = (await this.ethereumBridgeService.waitTransaction(txHash, startTime, {
                            maxIntervalTime,
                            intervalTime,
                        }));
                        const isSuccessful = txReceipt && custom_web3_utils_1.checkTxIsSuccessful(txReceipt);
                        if (!isSuccessful) {
                            await this.bridgeEventService.save(Object.assign(Object.assign({}, eventToTrigger), { retryCount: eventToTrigger.retryCount + 1 }));
                        }
                        await this.bridgeEventService.save(Object.assign(Object.assign({}, eventToTrigger), { targetTx: txHash, status: 1 }));
                    }
                    else if (targetChain === batch_types_1.BatchChainId.BURN) {
                        const txHash = await this.burnBridgeService.sendMethods(methodBody);
                        const startTime = Date.now();
                        const txReceipt = (await this.burnBridgeService.waitTransaction(txHash, startTime, {
                            maxIntervalTime,
                            intervalTime,
                        }));
                        const isSuccessful = txReceipt && custom_web3_utils_1.checkTxIsSuccessful(txReceipt);
                        if (!isSuccessful) {
                            await this.bridgeEventService.save(Object.assign(Object.assign({}, eventToTrigger), { retryCount: eventToTrigger.retryCount + 1 }));
                        }
                        await this.bridgeEventService.save(Object.assign(Object.assign({}, eventToTrigger), { targetTx: txHash, status: 1 }));
                    }
                    else {
                        this.logger.log(`This is incorrect event: ${targetChain}`);
                    }
                }
                catch (error) {
                    await this.bridgeEventService.save(Object.assign(Object.assign({}, eventToTrigger), { retryCount: eventToTrigger.retryCount + 1 }));
                }
            }
            this.triggeringBridgeEvents = false;
        }
        catch (error) {
            this.triggeringBridgeEvents = false;
            this.logger.error(`triggerBridgeEvent error ${error}`);
        }
    }
};
__decorate([
    schedule_1.Interval(monitorIntervalTime * 1000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppService.prototype, "monitorEthereumEvents", null);
__decorate([
    schedule_1.Interval(monitorIntervalTime * 1000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppService.prototype, "monitorBurnEvents", null);
__decorate([
    schedule_1.Interval(monitorIntervalTime * 1000),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AppService.prototype, "triggerBridgeEvent", null);
AppService = AppService_1 = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [config_1.ConfigService,
        batch_service_1.BatchService,
        ethereum_bridge_service_1.EthereumBridgeService,
        burn_bridge_service_1.BurnBridgeService,
        bridge_event_service_1.BridgeEventService])
], AppService);
exports.AppService = AppService;
//# sourceMappingURL=app.service.js.map