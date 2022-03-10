import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';

import { AppController } from './app.controller';
import { AppService } from './app.service';
import { validationSchema } from './config/validationSchema';
import { BridgeEventsModule } from './bridge-event/bridge-event.module';
import { BatchModule } from './batch/batch.module';
import { EthereumBridgeModule } from './ethereum-bridge/ethereum-bridge.module';
import { BurnBridgeModule } from './burn-bridge/burn-bridge.module';

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule.forRoot({ isGlobal: true, validationSchema })],
      useFactory: (configService: ConfigService) => {
        return {
          type: configService.get<string>('DATABASE_TYPE') as any,
          host: configService.get<string>('MYSQL_HOST'),
          port: configService.get<number>('MYSQL_PORT'), //* In case you don't have a .env file
          username: configService.get<string>('MYSQL_USER'),
          database: configService.get<string>('MYSQL_DATABASE'),
          password: configService.get<string>('MYSQL_PASSWORD'),
          autoLoadEntities: true, //* TRY AUTO LOAD ENTITIES
          entities: [__dirname + '**/*/entities/*.entity{.js, .ts}'],
          migrations: ['src/db/migrations/*.js'],
          synchronize: true,
          cli: {
            migrationsDir: 'src/db/migrations',
          },
        };
      },
      inject: [ConfigService],
    }),
    BridgeEventsModule,
    BatchModule,
    EthereumBridgeModule,
    BurnBridgeModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
