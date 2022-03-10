import { NestFactory } from '@nestjs/core';
import * as dotenv from 'dotenv';

import { AppModule } from './app.module';
import { AppService } from './app.service';

dotenv.config({
  path: '.env',
});

async function bootstrap() {
  const { PORT } = process.env;
  const app = await NestFactory.create(AppModule);
  const appService = app.get(AppService);
  await app.listen(PORT);
  console.log(`Server started listening on port: ${PORT}`);

  // initialize data & run batches
  appService.monitorEthereumEvents();
  appService.monitorBurnEvents();
}
bootstrap();
