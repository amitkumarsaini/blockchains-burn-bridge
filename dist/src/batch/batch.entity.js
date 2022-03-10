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
exports.Batches = void 0;
const typeorm_1 = require("typeorm");
const base_entity_1 = require("../base/base.entity");
let Batches = class Batches extends base_entity_1.AbstractEntity {
};
__decorate([
    typeorm_1.PrimaryColumn({
        length: 255,
        name: 'key_name',
    }),
    __metadata("design:type", String)
], Batches.prototype, "keyName", void 0);
__decorate([
    typeorm_1.PrimaryColumn({
        length: 64,
        name: 'chain_id',
    }),
    __metadata("design:type", String)
], Batches.prototype, "chainId", void 0);
__decorate([
    typeorm_1.Column({ name: 'last_blockNumber', type: 'bigint' }),
    __metadata("design:type", Number)
], Batches.prototype, "lastBlockNumber", void 0);
__decorate([
    typeorm_1.CreateDateColumn({ name: 'created_at', type: 'datetime' }),
    __metadata("design:type", Date)
], Batches.prototype, "createdAt", void 0);
__decorate([
    typeorm_1.UpdateDateColumn({ name: 'updated_at', type: 'datetime' }),
    __metadata("design:type", Date)
], Batches.prototype, "updatedAt", void 0);
Batches = __decorate([
    typeorm_1.Entity()
], Batches);
exports.Batches = Batches;
//# sourceMappingURL=batch.entity.js.map