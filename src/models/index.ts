import { Sequelize } from 'sequelize';
import {databaseHost, databaseName, databasePassword, databaseUsername} from "../config";

const sequelize = new Sequelize(
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