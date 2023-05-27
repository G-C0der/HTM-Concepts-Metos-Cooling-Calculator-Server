import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index';

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;

  // timestamps!
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

User.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  email: {
    type: new DataTypes.STRING(128),
    allowNull: false,
    unique: true
  },
  password: {
    type: new DataTypes.STRING(128),
    allowNull: false
  },
},
{
  sequelize,
  tableName: 'users',
});

export {
  User
};