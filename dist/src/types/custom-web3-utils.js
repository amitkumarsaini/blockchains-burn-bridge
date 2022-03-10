"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.checkTxIsSuccessful = void 0;
const checkTxIsSuccessful = (receipt) => {
    if ((receipt && receipt.status == '0x1') || receipt.status == true) {
        return true;
    }
    else {
        return false;
    }
};
exports.checkTxIsSuccessful = checkTxIsSuccessful;
//# sourceMappingURL=custom-web3-utils.js.map