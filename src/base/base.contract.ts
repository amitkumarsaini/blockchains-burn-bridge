import { Contract } from 'web3-eth-contract';
// eslint-disable-next-line @typescript-eslint/no-var-requires
const Web3 = require('web3');

import { ISendMethodsParams, WaitTxOptions } from '../types/custom-web3-utils';
import { TransactionReceipt } from 'web3-core';

const DEFAULT_BLOCKS_TO_WAIT = 0;
export abstract class BaseContract {
  private web3;
  private bridgeContractAddress: string;
  private bridgeContract: Contract;
  constructor(web3Provider: string, contractAddress: string, contractABI) {
    this.web3 = new Web3(web3Provider);
    this.bridgeContractAddress = contractAddress;
    this.bridgeContract = new this.web3.eth.Contract(
      contractABI,
      contractAddress,
    );
  }

  public async getEvents(eventName: string, lastBlockNumber: number) {
    const fromBlock = parseInt(lastBlockNumber.toString()) + 1;
    const result = await this.bridgeContract.getPastEvents(eventName, {
      fromBlock,
    });

    return result;
  }

  private async sendTx(
    sendObject,
    contractAddress: string,
    privateKey: string,
    nonce?: number,
  ) {
    const web3 = this.web3;
    const estimationGasDefault = 1000000;
    try {
      let gas = 0;
      let gasPrice = '0';
      const account = web3.eth.accounts.privateKeyToAccount(privateKey);
      if (!nonce) {
        const count = await web3.eth.getTransactionCount(account.address);
        nonce = web3.utils.toHex(count);
      }
      try {
        gas = await sendObject.estimateGas();
      } catch (err) {
        gas = web3.utils.toHex(estimationGasDefault);
      }

      gasPrice = (web3.utils as any).toWei('70', 'gwei');

      try {
        gasPrice = await web3.eth.getGasPrice();
      } catch (err) {
        // do nothing
        console.log(`getGasPrice error, use 70 gwei as default: ${err}`);
      }

      const rawTx = {
        from: account.address,
        to: contractAddress,
        gasPrice: web3.utils.toHex(gasPrice),
        gas,
        nonce,
        data: sendObject.encodeABI(),
      };

      const signedData = await web3.eth.accounts.signTransaction(
        rawTx,
        privateKey,
      );
      const { transactionHash } = await web3.eth.sendSignedTransaction(
        signedData.rawTransaction,
      );

      return transactionHash as string;
    } catch (err) {
      throw err;
    }
  }

  public async sendMethods(body: ISendMethodsParams) {
    const { params, method, privateKey, nonce } = body;

    const methodPromise = this.bridgeContract.methods[method](...params);

    try {
      const result = await this.sendTx(
        methodPromise,
        this.bridgeContractAddress,
        privateKey,
        nonce,
      );
      return result;
    } catch (err) {
      throw `${method} - ${err}`;
    }
  }

  waitTransaction = async (
    txnHash: string | string[],
    startTime: number,
    options: WaitTxOptions = null,
  ): Promise<TransactionReceipt | TransactionReceipt[]> => {
    const web3 = this.web3;
    const maxIntervalTime = options?.maxIntervalTime || 60;
    const intervalTime = options?.intervalTime || 1000;
    const blocksToWait = options?.blocksToWait || DEFAULT_BLOCKS_TO_WAIT;

    if (Date.now() - startTime > maxIntervalTime) {
      const errMsg = `Timeout to wait transacion is confirmed`;
      console.error(errMsg);
      // throw new Error(errMsg);
      return null;
    }

    const transactionReceiptAsync = async (txHash: string, resolve, reject) => {
      try {
        const receipt = await web3.eth.getTransactionReceipt(txHash);
        if (!receipt) {
          setTimeout(() => {
            transactionReceiptAsync(txHash, resolve, reject);
          }, intervalTime);
        } else {
          if (blocksToWait > 0) {
            const resolvedReceipt = receipt;
            if (!resolvedReceipt || !resolvedReceipt.blockNumber)
              setTimeout(() => {
                transactionReceiptAsync(txHash, resolve, reject);
              }, intervalTime);
            else {
              try {
                const block = await web3.eth.getBlock(
                  resolvedReceipt.blockNumber,
                );
                const current = await web3.eth.getBlock('latest');
                if (current.number - block.number >= blocksToWait) {
                  const txn = await web3.eth.getTransaction(txHash);
                  if (txn.blockNumber) {
                    resolve(resolvedReceipt);
                  } else {
                    const errMsg = `Transaction with hash: ${txHash} ended up in an uncle block.`;
                    reject(new Error(errMsg));
                  }
                } else
                  setTimeout(() => {
                    transactionReceiptAsync(txHash, resolve, reject);
                  }, intervalTime);
              } catch (e) {
                setTimeout(() => {
                  transactionReceiptAsync(txHash, resolve, reject);
                }, intervalTime);
              }
            }
          } else {
            resolve(receipt);
          }
        }
      } catch (e) {
        reject(e);
      }
    };

    // Resolve multiple transactions once
    if (Array.isArray(txnHash)) {
      const promises = [];
      txnHash.forEach((oneTxHash) => {
        promises.push(this.waitTransaction(oneTxHash, startTime, options));
      });
      return Promise.all(promises);
    } else {
      return new Promise((resolve, reject) => {
        transactionReceiptAsync(txnHash, resolve, reject);
      });
    }
  };
}
