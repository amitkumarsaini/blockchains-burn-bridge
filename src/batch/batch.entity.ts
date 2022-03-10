import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  UpdateDateColumn,
} from 'typeorm';

import { AbstractEntity } from '../base/base.entity';

@Entity()
export class Batches extends AbstractEntity<Batches> {
  @PrimaryColumn({
    length: 255,
    name: 'key_name',
  })
  keyName: string;

  @PrimaryColumn({
    length: 64,
    name: 'chain_id',
  })
  chainId: string;

  @Column({ name: 'last_blockNumber', type: 'bigint' })
  lastBlockNumber: number;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;
}
