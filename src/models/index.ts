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

export {
  sequelize
};

export * from './User';