import { MigrationInterface, QueryRunner } from 'typeorm';
export declare class InitializeDB1622687133525 implements MigrationInterface {
    name: string;
    up(queryRunner: QueryRunner): Promise<void>;
    down(queryRunner: QueryRunner): Promise<void>;
}
