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

// Models initialization
import { User } from './User';
import { AuditLog } from './AuditLog';

// Relations setup
import './relations';

export {
  sequelize,
  User,
  AuditLog
};