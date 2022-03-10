import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryColumn,
  BeforeInsert,
  UpdateDateColumn,
} from 'typeorm';

import { AbstractEntity } from '../base/base.entity';

@Entity({ name: 'bridge_events' })
export class BridgeEvent extends AbstractEntity<BridgeEvent> {
  @PrimaryColumn({
    type: 'varchar',
    length: 255,
    name: 'source_tx',
    default: '',
  })
  sourceTx: string;

  @Column({ type: 'char', length: 6, name: 'source_chain', nullable: false })
  sourceChain: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'source_token',
    nullable: true,
  })
  sourceToken: string;

  @Column({ type: 'varchar', length: 255, name: 'target_tx', nullable: true })
  targetTx: string;

  @Column({ type: 'char', length: 6, name: 'target_chain', nullable: true })
  targetChain: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'target_token',
    nullable: true,
  })
  targetToken: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'from_address',
    nullable: true,
  })
  fromAddress: string;

  @Column({
    type: 'varchar',
    length: 255,
    name: 'to_address',
    nullable: true,
  })
  toAddress: string;

  @Column({
    type: 'decimal',
    precision: 65,
    scale: 0,
    name: 'amount',
    nullable: true,
  })
  amount: number;

  @Column({ type: 'tinyint', name: 'status', nullable: true })
  status: number;

  @Column({ type: 'int', name: 'retry_count', default: 0 })
  retryCount: number;

  @UpdateDateColumn({ name: 'updated_at', type: 'datetime' })
  updatedAt: Date;

  @CreateDateColumn({ name: 'created_at', type: 'datetime' })
  createdAt: Date;

  @BeforeInsert()
  checkPKValue() {
    if (!this.sourceTx) {
      throw new Error(`sourceTX must have a not null value`);
    }
  }
}
