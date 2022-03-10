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
Object.defineProperty(exports, "__esModule", { value: true });
exports.BridgeEvent = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../base/base.entity");
let BridgeEvent = class BridgeEvent extends base_entity_1.AbstractEntity {
    checkPKValue() {
        if (!this.sourceTx) {
            throw new Error(`sourceTX must have a not null value`);
        }
    }
};
__decorate([
    typeorm_1.PrimaryColumn({
        type: 'varchar',
        length: 255,
        name: 'source_tx',
        default: '',
    }),
    __metadata("design:type", String)
], BridgeEvent.prototype, "sourceTx", void 0);
__decorate([
    typeorm_1.Column({ type: 'char', length: 6, name: 'source_chain', nullable: false }),
    __metadata("design:type", String)
], BridgeEvent.prototype, "sourceChain", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 255,
        name: 'source_token',
        nullable: true,
    }),
    __metadata("design:type", String)
], BridgeEvent.prototype, "sourceToken", void 0);
__decorate([
    typeorm_1.Column({ type: 'varchar', length: 255, name: 'target_tx', nullable: true }),
    __metadata("design:type", String)
], BridgeEvent.prototype, "targetTx", void 0);
__decorate([
    typeorm_1.Column({ type: 'char', length: 6, name: 'target_chain', nullable: true }),
    __metadata("design:type", String)
], BridgeEvent.prototype, "targetChain", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 255,
        name: 'target_token',
        nullable: true,
    }),
    __metadata("design:type", String)
], BridgeEvent.prototype, "targetToken", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 255,
        name: 'from_address',
        nullable: true,
    }),
    __metadata("design:type", String)
], BridgeEvent.prototype, "fromAddress", void 0);
__decorate([
    typeorm_1.Column({
        type: 'varchar',
        length: 255,
        name: 'to_address',
        nullable: true,
    }),
    __metadata("design:type", String)
], BridgeEvent.prototype, "toAddress", void 0);
__decorate([
    typeorm_1.Column({
        type: 'decimal',
        precision: 65,
        scale: 0,
        name: 'amount',
        nullable: true,
    }),
    __metadata("design:type", Number)
], BridgeEvent.prototype, "amount", void 0);
__decorate([
    typeorm_1.Column({ type: 'tinyint', name: 'status', nullable: true }),
    __metadata("design:type", Number)
], BridgeEvent.prototype, "status", void 0);
__decorate([
    typeorm_1.Column({ type: 'int', name: 'retry_count', default: 0 }),
    __metadata("design:type", Number)
], BridgeEvent.prototype, "retryCount", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], BridgeEvent.prototype, "updatedAt", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], BridgeEvent.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.BeforeInsert(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], BridgeEvent.prototype, "checkPKValue", null);
BridgeEvent = __decorate([
    typeorm_1.Entity({ name: 'bridge_events' })
], BridgeEvent);
exports.BridgeEvent = BridgeEvent;
//# sourceMappingURL=bridge-event.entity.js.map