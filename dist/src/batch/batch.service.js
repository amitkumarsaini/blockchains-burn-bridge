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
var BatchService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BatchService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const batch_entity_1 = require("./batch.entity");
const create_batch_dto_1 = require("./dto/create-batch.dto");
let BatchService = BatchService_1 = class BatchService {
    constructor(batchRepo) {
        this.batchRepo = batchRepo;
        this.logger = new common_1.Logger(BatchService_1.name);
    }
    async updateBlockNumber(keyName, chainId, lastBlockNumber) {
        const newBatch = await this.batchRepo.save(new batch_entity_1.Batches({
            keyName,
            chainId,
            lastBlockNumber,
        }));
        this.logger.log(`[${chainId}] Updated blockNumber of ${keyName} with blk ${lastBlockNumber}`);
        return newBatch;
    }
    async getLastBlockNumber(keyName, chainId) {
        let batch = await this.batchRepo.findOne({ keyName, chainId });
        if (!batch) {
            const newBatch = new create_batch_dto_1.CreateBatchDto();
            newBatch.keyName = keyName;
            newBatch.chainId = chainId;
            newBatch.lastBlockNumber = 0;
            batch = await this.batchRepo.save(newBatch);
        }
        return batch.lastBlockNumber || 0;
    }
};
BatchService = BatchService_1 = __decorate([
    common_1.Injectable(),
    __param(0, typeorm_1.InjectRepository(batch_entity_1.Batches)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], BatchService);
exports.BatchService = BatchService;
//# sourceMappingURL=batch.service.js.map