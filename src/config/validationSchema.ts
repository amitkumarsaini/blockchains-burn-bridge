import * as Joi from 'joi';

export const validationSchema = Joi.object({
  // Database
  MYSQL_HOST: Joi.required(),
  DATABASE_TYPE: Joi.required(),
  MYSQL_DATABASE: Joi.required(),
  MYSQL_USER: Joi.required(),
  MYSQL_PASSWORD: Joi.required(),
  MYSQL_PORT: Joi.required(),

  // Others
  BRIDGE_OWNER_PRIVATE_KEY: Joi.required(),
});
