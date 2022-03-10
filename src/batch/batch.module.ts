import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { Batches } from './batch.entity';
import { BatchService } from './batch.service';

@Module({
  imports: [TypeOrmModule.forFeature([Batches])],
  exports: [BatchService],
  providers: [BatchService],
})
export class BatchModule {}
