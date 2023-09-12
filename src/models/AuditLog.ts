import { DataTypes, Model } from 'sequelize';
import {sequelize} from './';

class AuditLog extends Model {
  public id!: number;
  public action!: string;
  public operatorId!: number;
  public userId!: number;
  public paramsId!: number;
  public before!: object;
  public after!: object;

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

AuditLog.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  action: {
    type: new DataTypes.STRING(30),
    allowNull: false
  },
  operatorId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  paramsId: {
    type: DataTypes.INTEGER.UNSIGNED,
    references: {
      model: 'calculator_params',
      key: 'id'
    }
  },
  before: {
    type: DataTypes.JSON,
    allowNull: false
  },
  after: {
    type: DataTypes.JSON,
    allowNull: false
  }
},
{
  sequelize,
  tableName: 'audit_logs',
});

export {
  AuditLog
};