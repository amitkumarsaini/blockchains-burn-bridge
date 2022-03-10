import * as dotenv from 'dotenv';
import { ConnectionOptions } from 'typeorm';

dotenv.config({
  path: `.env`,
});

const connectionOptions: ConnectionOptions = {
  type: process.env.DATABASE_TYPE as any,
  host: process.env.MYSQL_HOST,
  port: parseInt(process.env.MYSQL_PORT),
  username: process.env.MYSQL_USER,
  password: process.env.MYSQL_PASSWORD,
  database: process.env.MYSQL_DATABASE,
  synchronize: false,
  logging: true,
  entities: ['src/**/*.entity.ts'],
  migrations: ['src/db/migrations/**/*.ts'],
  cli: {
    migrationsDir: 'src/db/migrations',
  },
};

export default connectionOptions;
