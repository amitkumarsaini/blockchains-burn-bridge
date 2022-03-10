"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationSchema = void 0;
const Joi = require("joi");
exports.validationSchema = Joi.object({
    MYSQL_HOST: Joi.required(),
    DATABASE_TYPE: Joi.required(),
    MYSQL_DATABASE: Joi.required(),
    MYSQL_USER: Joi.required(),
    MYSQL_PASSWORD: Joi.required(),
    MYSQL_PORT: Joi.required(),
    BRIDGE_OWNER_PRIVATE_KEY: Joi.required(),
});
//# sourceMappingURL=validationSchema.js.map