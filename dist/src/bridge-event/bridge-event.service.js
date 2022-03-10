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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var BridgeEventService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BridgeEventService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const bridge_event_entity_1 = require("./bridge-event.entity");
let BridgeEventService = BridgeEventService_1 = class BridgeEventService {
    constructor(bridgeEventRepo) {
        this.bridgeEventRepo = bridgeEventRepo;
        this.logger = new common_1.Logger(BridgeEventService_1.name);
    }
    async save(bridgeEventDto) {
        const newEvent = new bridge_event_entity_1.BridgeEvent(Object.assign({}, bridgeEventDto));
        const result = await this.bridgeEventRepo.save(newEvent);
        this.logger.log(`Created or save the 'Bridge' event with source_tx: ${newEvent.sourceTx}`);
        return result;
    }
    async getEventsToTrigger() {
        const eventsToTrigger = await this.bridgeEventRepo.find({
            where: { status: 0, retryCount: typeorm_2.LessThan(10) },
        });
        return eventsToTrigger;
    }
};
BridgeEventService = BridgeEventService_1 = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(bridge_event_entity_1.BridgeEvent)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BridgeEventService);
exports.BridgeEventService = BridgeEventService;
//# sourceMappingURL=bridge-event.service.js.map