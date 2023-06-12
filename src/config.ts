import dotenv from 'dotenv';

dotenv.config();

const env = process.env.NODE_ENV || "development";
const isDevEnv = env === "development";
const isProdEnv = env === "production";

const appPort = process.env.PORT;

const databaseName = process.env.DB_NAME;
const databaseHost = process.env.DB_HOST;
const databasePort = process.env.DB_PORT;
const databaseUsername = process.env.DB_USERNAME || 'root';
const databasePassword = process.env.DB_PASSWORD;

const authSecret = process.env.AUTH_SECRET;
const verificationSecret = process.env.VERIFICATION_SECRET;
const passwordResetSecret = process.env.PASSWORD_RESET_SECRET;

const smtpExchangeHost = process.env.SMTP_EXCHANGE_HOST;
const smtpExchangePort = process.env.SMTP_EXCHANGE_PORT;
const smtpExchangeEmail = process.env.SMTP_EXCHANGE_EMAIL;
const smtpExchangePassword = process.env.SMTP_EXCHANGE_PASSWORD;

const clientBaseUrl = process.env.CLIENT_BASE_URL || 'http://localhost:3000';

const htmConceptsEmail = process.env.HTM_CONCEPTS_EMAIL || 'info@htm-concepts.ch';

const jawsDbMariaUrl = process.env.JAWSDB_MARIA_URL;

const redisUrl = process.env.REDIS_URL;

export {
  isDevEnv,
  isProdEnv,

  appPort,

  databaseName,
  databaseHost,
  databasePort,
  databaseUsername,
  databasePassword,

  authSecret,
  verificationSecret,
  passwordResetSecret,

  smtpExchangeHost,
  smtpExchangePort,
  smtpExchangeEmail,
  smtpExchangePassword,

  clientBaseUrl,
  htmConceptsEmail,

  jawsDbMariaUrl,

  redisUrl
};