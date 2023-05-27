import dotenv from 'dotenv';

dotenv.config();

const appPort = process.env.PORT;

const databaseName = process.env.DB_NAME;
const databaseHost = process.env.DB_HOST;
const databasePort = process.env.DB_PORT;
const databaseUsername = process.env.DB_USERNAME || 'root';
const databasePassword = process.env.DB_PASSWORD;

const secret = process.env.TOKEN_SECRET;

export {
  appPort,

  databaseName,
  databaseHost,
  databasePort,
  databaseUsername,
  databasePassword,

  secret
};