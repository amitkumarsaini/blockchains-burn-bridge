import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitializeDB1622687133525 implements MigrationInterface {
  name = 'InitializeDB1622687133525';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS `batches` (`key_name` varchar(255) NOT NULL, `chain_id` varchar(64) NOT NULL, `last_blockNumber` bigint NOT NULL, `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), PRIMARY KEY (`key_name`, `chain_id`)) ENGINE=InnoDB',
    );
    await queryRunner.query(
      'CREATE TABLE IF NOT EXISTS `bridge_events` (`source_tx` varchar(255) NOT NULL DEFAULT "", `source_chain` char(6) NOT NULL, `source_token` varchar(255) NULL, `target_tx` varchar(255) NULL, `target_chain` char(6) NULL, `target_token` varchar(255) NULL, `from_address` varchar(255) NULL, `to_address` varchar(255) NULL, `amount` decimal(65,0) NULL, `status` tinyint NULL, `retry_count` int NOT NULL DEFAULT "0", `updated_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6), `created_at` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6), PRIMARY KEY (`source_tx`)) ENGINE=InnoDB',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE `bridge_events`');
    await queryRunner.query('DROP TABLE `batches`');
  }
}
