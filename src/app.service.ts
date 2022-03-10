import { Injectable, Logger, BeforeApplicationShutdown } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Interval } from '@nestjs/schedule';
import { EventData } from 'web3-eth-contract';
import { TransactionReceipt } from 'web3-core';
import { once, EventEmitter } from 'events';

import { BatchService } from './batch/batch.service';
import { BatchEventName, BatchChainId } from './batch/batch.types';
import { BridgeEventService } from './bridge-event/bridge-event.service';
import { EthereumBridgeService } from './ethereum-bridge/ethereum-bridge.service';
import { CreateBridgeEventDto } from './bridge-event/dto/create-bridge-event.dto';
import { BurnBridgeService } from './burn-bridge/burn-bridge.service';
import * as BridgeConfig from './config/bridge-config.json';
import {
  checkTxIsSuccessful,
  ISendMethodsParams,
} from './types/custom-web3-utils';

const monitorIntervalTime = BridgeConfig.interval || 30;
@Injectable()
export class AppService implements BeforeApplicationShutdown {
  private eventEmitter = new EventEmitter();
  private fetchingEthereumEvents: boolean;
  private fetchingBurnEvents: boolean;
  private triggeringBridgeEvents: boolean;
  private logger = new Logger(AppService.name);
  private serverIsTerminating = false;

  constructor(
    private readonly configService: ConfigService,
    private readonly batchService: BatchService,
    private readonly ethereumBridgeService: EthereumBridgeService,
    private readonly burnBridgeService: BurnBridgeService,
    private readonly bridgeEventService: BridgeEventService,
  ) {}

  async beforeApplicationShutdown(signal: string) {
    this.logger.log(`Received signal : ${signal}`);
    this.serverIsTerminating = true;
    if (this.fetchingEthereumEvents || this.fetchingBurnEvents) {
      this.logger.log(`Waiting for event processing to be done...`);
      await once(this.eventEmitter, 'fetching done');
      this.logger.log(`Done, gracefully shutdown server`);
    }
  }

  @Interval(monitorIntervalTime * 1000)
  async monitorEthereumEvents() {
    this.logger.log(`monitorEthereumEvents is running..`);
    if (this.fetchingEthereumEvents || this.serverIsTerminating) {
      return;
    }
    try {
      this.fetchingEthereumEvents = true;
      let lastBlockNumber = await this.batchService.getLastBlockNumber(
        BatchEventName.BRIDGE_EVENT,
        BatchChainId.ETHEREUM,
      );
      lastBlockNumber = lastBlockNumber > 0 ? lastBlockNumber : Number(process.env.CHAIN1_START_BLOCK_NUMBER);
      let newLastBlockNumber = lastBlockNumber;
      const fetchedEvents: EventData[] =
        await this.ethereumBridgeService.getEvents(
          BatchEventName.BRIDGE_EVENT,
          lastBlockNumber,
        );

      for (const fetchedEvent of fetchedEvents) {
        const {
          transactionHash,
          blockNumber,
          returnValues: {
            _amount: amount,
            _from: from,
            _to: to,
            _token1: token1,
            _token2: token2,
          },
        } = fetchedEvent;

        if (!transactionHash) {
          // TODO: return error if 'txHash' is undefined because of PK is not null
        }

        const newEventData: CreateBridgeEventDto = {
          sourceTx: transactionHash,
          sourceChain: BatchChainId.ETHEREUM,
          sourceToken: token1 || '',
          targetTx: null,
          targetChain: BatchChainId.BURN,
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
        await this.batchService.updateBlockNumber(
          BatchEventName.BRIDGE_EVENT,
          BatchChainId.ETHEREUM,
          newLastBlockNumber,
        );
      }
      this.fetchingEthereumEvents = false;
    } catch (error) {
      this.fetchingEthereumEvents = false;
      this.logger.error(`monitorEthereumEvents error ${error}`);
    }
  }

  @Interval(monitorIntervalTime * 1000)
  async monitorBurnEvents() {
    this.logger.log(`monitorBurnEvents is running..`);
    if (this.fetchingBurnEvents || this.serverIsTerminating) {
      return;
    }
    try {
      this.fetchingBurnEvents = true;
      let lastBlockNumber = await this.batchService.getLastBlockNumber(
        BatchEventName.BRIDGE_EVENT,
        BatchChainId.BURN,
      );
      lastBlockNumber = lastBlockNumber > 0 ? lastBlockNumber : Number(process.env.CHAIN2_START_BLOCK_NUMBER);
      let newLastBlockNumber = lastBlockNumber;
      const fetchedEvents: EventData[] = await this.burnBridgeService.getEvents(
        BatchEventName.BRIDGE_EVENT,
        lastBlockNumber,
      );

      for (const fetchedEvent of fetchedEvents) {
        const {
          transactionHash,
          blockNumber,
          returnValues: {
            _amount: amount,
            _from: from,
            _to: to,
            _token1: token1,
            _token2: token2,
          },
        } = fetchedEvent;

        if (!transactionHash) {
          // TODO: return error if 'txHash' is undefined because of PK is not null
        }

        const newEventData: CreateBridgeEventDto = {
          sourceTx: transactionHash,
          sourceChain: BatchChainId.BURN,
          sourceToken: token1 || '',
          targetTx: null,
          targetChain: BatchChainId.ETHEREUM,
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
        await this.batchService.updateBlockNumber(
          BatchEventName.BRIDGE_EVENT,
          BatchChainId.BURN,
          newLastBlockNumber,
        );
      }
      this.fetchingBurnEvents = false;
    } catch (error) {
      this.fetchingBurnEvents = false;
      this.logger.error(`monitorBurnEvents error ${error}`);
    }
  }

  @Interval(monitorIntervalTime * 1000)
  async triggerBridgeEvent() {
    try {
      if (this.triggeringBridgeEvents) {
        return;
      }
      this.triggeringBridgeEvents = true;
      this.logger.log(`triggerBridgeEvent is running..`);
      const eventsToTrigger =
        await this.bridgeEventService.getEventsToTrigger();

      for (const eventToTrigger of eventsToTrigger) {
        try {
          const { sourceTx, targetChain, targetToken, toAddress, amount } =
            eventToTrigger;
          const bridgeOwnerPK = this.configService.get<string>(
            'BRIDGE_OWNER_PRIVATE_KEY',
          );

          const methodBody: ISendMethodsParams = {
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

          this.logger.log(
            `[${targetChain}] triggering with sourceTx: ${sourceTx}`,
          );

          if (targetChain === BatchChainId.ETHEREUM) {
            const txHash = await this.ethereumBridgeService.sendMethods(
              methodBody,
            );
            const startTime = Date.now();

            const txReceipt = (await this.ethereumBridgeService.waitTransaction(
              txHash,
              startTime,
              {
                maxIntervalTime,
                intervalTime,
              },
            )) as TransactionReceipt;

            const isSuccessful = txReceipt && checkTxIsSuccessful(txReceipt);
            if (!isSuccessful) {
              // tx fail or timeout to wait confirmation
              await this.bridgeEventService.save({
                ...eventToTrigger,
                retryCount: eventToTrigger.retryCount + 1,
              });
            }

            await this.bridgeEventService.save({
              ...eventToTrigger,
              targetTx: txHash,
              status: 1,
            });
          } else if (targetChain === BatchChainId.BURN) {
            const txHash = await this.burnBridgeService.sendMethods(methodBody);
            const startTime = Date.now();

            const txReceipt = (await this.burnBridgeService.waitTransaction(
              txHash,
              startTime,
              {
                maxIntervalTime,
                intervalTime,
              },
            )) as TransactionReceipt;

            const isSuccessful = txReceipt && checkTxIsSuccessful(txReceipt);
            if (!isSuccessful) {
              // tx fail or timeout to wait confirmation
              await this.bridgeEventService.save({
                ...eventToTrigger,
                retryCount: eventToTrigger.retryCount + 1,
              });
            }

            await this.bridgeEventService.save({
              ...eventToTrigger,
              targetTx: txHash,
              status: 1,
            });
          } else {
            this.logger.log(`This is incorrect event: ${targetChain}`);
          }
        } catch (error) {
          await this.bridgeEventService.save({
            ...eventToTrigger,
            retryCount: eventToTrigger.retryCount + 1,
          });
        }
      }
      this.triggeringBridgeEvents = false;
    } catch (error) {
      this.triggeringBridgeEvents = false;
      this.logger.error(`triggerBridgeEvent error ${error}`);
    }
  }
}
