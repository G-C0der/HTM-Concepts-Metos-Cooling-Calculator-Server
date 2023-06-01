import { DataTypes, Model } from 'sequelize';
import { sequelize } from './index';

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public verified!: boolean;
  public active!: boolean;
  public admin!: boolean;
  public title?: string;
  public fname?: string;
  public lname?: string;
  public phone?: string;
  public country?: string;
  public city?: string;
  public zip?: string;
  public street?: string;
  public company?: string;
  public website?: string;

  // timestamps
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
  verified: {
    type: new DataTypes.BOOLEAN(),
    defaultValue: false
  },
  active: {
    type: new DataTypes.BOOLEAN(),
    defaultValue: false
  },
  admin: {
    type: new DataTypes.BOOLEAN(),
    defaultValue: false
  },
  title: {
    type: new DataTypes.STRING(64)
  },
  fname: {
    type: new DataTypes.STRING(64)
  },
  lname: {
    type: new DataTypes.STRING(64)
  },
  phone: {
    type: new DataTypes.STRING(32)
  },
  country: {
    type: new DataTypes.STRING(64)
  },
  city: {
    type: new DataTypes.STRING(64)
  },
  zip: {
    type: new DataTypes.STRING(16)
  },
  street: {
    type: new DataTypes.STRING(128)
  },
  company: {
    type: new DataTypes.STRING(256)
  },
  website: {
    type: new DataTypes.STRING(512)
  }
},
{
  sequelize,
  tableName: 'users',
});

export {
  User
};