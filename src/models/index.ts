import { Sequelize } from 'sequelize';
import {databaseHost, databaseName, databasePassword, databaseUsername, jawsDbMariaUrl} from "../config";

const isHerokuHost = !!jawsDbMariaUrl;

const sequelize = isHerokuHost
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

export {
  sequelize
};

export * from './User';