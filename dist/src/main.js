"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const dotenv = require("dotenv");
const app_module_1 = require("./app.module");
const app_service_1 = require("./app.service");
dotenv.config({
    path: '.env',
});
async function bootstrap() {
    const { PORT } = process.env;
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const appService = app.get(app_service_1.AppService);
    await app.listen(PORT);
    console.log(`Server started listening on port: ${PORT}`);
    appService.monitorEthereumEvents();
    appService.monitorBurnEvents();
}
bootstrap();
//# sourceMappingURL=main.js.map