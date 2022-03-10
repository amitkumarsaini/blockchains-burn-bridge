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
exports.EthereumBridgeService = void 0;
const common_1 = require("@nestjs/common");
const BridgeConfig = require("../config/bridge-config.json");
const BridgeContractABI = require("../config/bridge-contract-ABI.json");
const base_contract_1 = require("../base/base.contract");
let EthereumBridgeService = class EthereumBridgeService extends base_contract_1.BaseContract {
    constructor() {
        const web3Provider = BridgeConfig.chain1.rpcEndpoint;
        const contractAddress = BridgeConfig.chain1.contractAddress;
        const contractABI = BridgeContractABI;
        super(web3Provider, contractAddress, contractABI);
    }
};
EthereumBridgeService = __decorate([
    common_1.Injectable(),
    __metadata("design:paramtypes", [])
], EthereumBridgeService);
exports.EthereumBridgeService = EthereumBridgeService;
//# sourceMappingURL=ethereum-bridge.service.js.map