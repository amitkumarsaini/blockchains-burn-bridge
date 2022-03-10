"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
dotenv.config({
    path: `.env`,
});
const connectionOptions = {
    type: process.env.DATABASE_TYPE,
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
exports.default = connectionOptions;
//# sourceMappingURL=ormconfig.js.map