import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Batches } from './batch.entity';
import { CreateBatchDto } from './dto/create-batch.dto';

@Injectable()
export class BatchService {
  private logger = new Logger(BatchService.name);

  constructor(
    @InjectRepository(Batches)
    private readonly batchRepo: Repository<Batches>,
  ) {}

  async updateBlockNumber(
    keyName: string,
    chainId: string,
    lastBlockNumber: number,
  ) {
    const newBatch = await this.batchRepo.save(
      new Batches({
        keyName,
        chainId,
        lastBlockNumber,
      }),
    );

    this.logger.log(
      `[${chainId}] Updated blockNumber of ${keyName} with blk ${lastBlockNumber}`,
    );
    return newBatch;
  }

  async getLastBlockNumber(keyName: string, chainId: string) {
    let batch = await this.batchRepo.findOne({ keyName, chainId });

    if (!batch) {
      const newBatch = new CreateBatchDto();
      newBatch.keyName = keyName;
      newBatch.chainId = chainId;
      newBatch.lastBlockNumber = 0;
      batch = await this.batchRepo.save(newBatch);
    }

    return batch.lastBlockNumber || 0;
  }
}
