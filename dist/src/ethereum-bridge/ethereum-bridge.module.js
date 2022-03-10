"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EthereumBridgeModule = void 0;
const common_1 = require("@nestjs/common");
const ethereum_bridge_service_1 = require("./ethereum-bridge.service");
let EthereumBridgeModule = class EthereumBridgeModule {
};
EthereumBridgeModule = __decorate([
    common_1.Module({
        exports: [ethereum_bridge_service_1.EthereumBridgeService],
        providers: [ethereum_bridge_service_1.EthereumBridgeService],
    })
], EthereumBridgeModule);
exports.EthereumBridgeModule = EthereumBridgeModule;
//# sourceMappingURL=ethereum-bridge.module.js.map