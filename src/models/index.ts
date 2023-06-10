import { Sequelize } from 'sequelize';
import {databaseHost, databaseName, databasePassword, databaseUsername, jawsDBMariaURL} from "../config";

const isHerokuHost = !!jawsDBMariaURL;

const sequelize = isHerokuHost
  ? new Sequelize(jawsDBMariaURL!, {
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