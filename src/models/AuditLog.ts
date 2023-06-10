import { DataTypes, Model } from 'sequelize';
import {sequelize} from './';

class AuditLog extends Model {
  public id!: number;

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
  operator: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  user: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'users',
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