"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const schedule_1 = require("@nestjs/schedule");
const typeorm_1 = require("@nestjs/typeorm");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const validationSchema_1 = require("./config/validationSchema");
const bridge_event_module_1 = require("./bridge-event/bridge-event.module");
const batch_module_1 = require("./batch/batch.module");
const ethereum_bridge_module_1 = require("./ethereum-bridge/ethereum-bridge.module");
const burn_bridge_module_1 = require("./burn-bridge/burn-bridge.module");
let AppModule = class AppModule {
};
AppModule = __decorate([
    common_1.Module({
        imports: [
            typeorm_1.TypeOrmModule.forRootAsync({
                imports: [config_1.ConfigModule.forRoot({ isGlobal: true, validationSchema: validationSchema_1.validationSchema })],
                useFactory: (configService) => {
                    return {
                        type: configService.get('DATABASE_TYPE'),
                        host: configService.get('MYSQL_HOST'),
                        port: configService.get('MYSQL_PORT'),
                        username: configService.get('MYSQL_USER'),
                        database: configService.get('MYSQL_DATABASE'),
                        password: configService.get('MYSQL_PASSWORD'),
                        autoLoadEntities: true,
                        entities: [__dirname + '**/*/entities/*.entity{.js, .ts}'],
                        migrations: ['src/db/migrations/*.js'],
                        synchronize: true,
                        cli: {
                            migrationsDir: 'src/db/migrations',
                        },
                    };
                },
                inject: [config_1.ConfigService],
            }),
            bridge_event_module_1.BridgeEventsModule,
            batch_module_1.BatchModule,
            ethereum_bridge_module_1.EthereumBridgeModule,
            burn_bridge_module_1.BurnBridgeModule,
            schedule_1.ScheduleModule.forRoot(),
        ],
        controllers: [app_controller_1.AppController],
        providers: [app_service_1.AppService],
    })
], AppModule);
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map