import { Sequelize } from 'sequelize';
import {databaseHost, databaseName, databasePassword, databaseUsername, isProdEnv, jawsDbMariaUrl} from "../config";

const sequelize = isProdEnv
  ? new Sequelize(jawsDbMariaUrl!, {
      dialect: 'mysql',
      protocol: 'mysql',
      dialectOptions: {
        ssl: {
          require: true,
          rejectUnauthorized: false,
        },
      },
    })
  : new Sequelize(
      databaseName!,
      databaseUsername,
      databasePassword, {
        host: databaseHost,
        dialect: 'mysql'
      }
    );

const development = {
  username: databaseUsername,
  password: databasePassword,
  database: databaseName,
  host: databaseHost,
  dialect: 'mysql'
};

const production = {
  use_env_variable: 'JAWSDB_MARIA_URL',
  dialect: 'mysql',
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    }
  }
};

// Models initialization
import { User } from './User';
import { AuditLog } from './AuditLog';

// Relations setup
import './relations';

export {
  // Sequelize instance
  sequelize,

  // Sequelize CLI config
  development,
  production,

  // Models
  User,
  AuditLog
};
