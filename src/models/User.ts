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
    unique: true,
    set (value: string) {
      this.setDataValue('email', value.trim());
    }
  },
  password: {
    type: new DataTypes.STRING(128),
    allowNull: false
  },
  verified: {
    type: new DataTypes.BOOLEAN(),
    allowNull: false,
    defaultValue: false
  },
  active: {
    type: new DataTypes.BOOLEAN(),
    allowNull: false,
    defaultValue: false
  },
  admin: {
    type: new DataTypes.BOOLEAN(),
    allowNull: false,
    defaultValue: false
  },
  title: {
    type: new DataTypes.STRING(64),
    set (value: string) {
      this.setDataValue('title', value.trim());
    }
  },
  fname: {
    type: new DataTypes.STRING(64),
    set (value: string) {
      this.setDataValue('fname', value.trim());
    }
  },
  lname: {
    type: new DataTypes.STRING(64),
    set (value: string) {
      this.setDataValue('lname', value.trim());
    }
  },
  phone: {
    type: new DataTypes.STRING(32),
    set (value: string) {
      this.setDataValue('phone', value.trim());
    }
  },
  country: {
    type: new DataTypes.STRING(64),
    set (value: string) {
      this.setDataValue('country', value.trim());
    }
  },
  city: {
    type: new DataTypes.STRING(64),
    set (value: string) {
      this.setDataValue('city', value.trim());
    }
  },
  zip: {
    type: new DataTypes.STRING(16),
    set (value: string) {
      this.setDataValue('zip', value.trim());
    }
  },
  street: {
    type: new DataTypes.STRING(128),
    set (value: string) {
      this.setDataValue('street', value.trim());
    }
  },
  company: {
    type: new DataTypes.STRING(256),
    set (value: string) {
      this.setDataValue('company', value.trim());
    }
  },
  website: {
    type: new DataTypes.STRING(512),
    set (value: string) {
      this.setDataValue('website', value.trim());
    }
  }
},
{
  sequelize,
  tableName: 'users',
});

export {
  User
};