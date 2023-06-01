import dotenv from 'dotenv';

dotenv.config();

const appPort = process.env.PORT;

const databaseName = process.env.DB_NAME;
const databaseHost = process.env.DB_HOST;
const databasePort = process.env.DB_PORT;
const databaseUsername = process.env.DB_USERNAME || 'root';
const databasePassword = process.env.DB_PASSWORD;

const secret = process.env.SECRET;

const smtpExchangeHost = process.env.SMTP_EXCHANGE_HOST;
const smtpExchangePort = process.env.SMTP_EXCHANGE_PORT;
const smtpExchangeEmail = process.env.SMTP_EXCHANGE_EMAIL;
const smtpExchangePassword = process.env.SMTP_EXCHANGE_PASSWORD;

const jawsDBMariaURL = process.env.JAWSDB_MARIA_URL;

export {
  appPort,

  databaseName,
  databaseHost,
  databasePort,
  databaseUsername,
  databasePassword,

  secret,

  smtpExchangeHost,
  smtpExchangePort,
  smtpExchangeEmail,
  smtpExchangePassword,

  jawsDBMariaURL
};