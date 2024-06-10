import { DataTypes, Model } from 'sequelize';
import {sequelize} from './';
import {userFieldLengths} from "../constants";
import {UserMode} from "../enums/UserMode";

class User extends Model {
  public id!: number;
  public email!: string;
  public password!: string;
  public mode!: string;
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
    type: new DataTypes.STRING(userFieldLengths.email.max),
    allowNull: false,
    unique: true,
    set (value: string) {
      this.setDataValue('email', value.trim().toLowerCase());
    }
  },
  password: {
    type: new DataTypes.STRING(128),
    allowNull: false
  },
  mode: {
    type: new DataTypes.STRING(16),
    allowNull: false,
    defaultValue: UserMode.UserModeMetos,
    validate: {
      isModeValid(mode: any) {
        if (!Object.values(UserMode).includes(mode)) throw new Error('Invalid mode.');
      }
    }
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
    type: new DataTypes.STRING(userFieldLengths.title.max),
    set (value: string) {
      this.setDataValue('title', value.trim());
    }
  },
  fname: {
    type: new DataTypes.STRING(userFieldLengths.fname.max),
    set (value: string) {
      this.setDataValue('fname', value.trim());
    }
  },
  lname: {
    type: new DataTypes.STRING(userFieldLengths.lname.max),
    set (value: string) {
      this.setDataValue('lname', value.trim());
    }
  },
  phone: {
    type: new DataTypes.STRING(userFieldLengths.phone.max),
    set (value: string) {
      this.setDataValue('phone', value.trim());
    }
  },
  country: {
    type: new DataTypes.STRING(userFieldLengths.country.max),
    set (value: string) {
      this.setDataValue('country', value.trim().toLowerCase());
    }
  },
  city: {
    type: new DataTypes.STRING(userFieldLengths.city.max),
    set (value: string) {
      this.setDataValue('city', value.trim());
    }
  },
  zip: {
    type: new DataTypes.STRING(userFieldLengths.zip.max),
    set (value: string) {
      this.setDataValue('zip', value.trim());
    }
  },
  street: {
    type: new DataTypes.STRING(userFieldLengths.street.max),
    set (value: string) {
      this.setDataValue('street', value.trim());
    }
  },
  company: {
    type: new DataTypes.STRING(userFieldLengths.company.max),
    set (value: string) {
      this.setDataValue('company', value.trim());
    }
  },
  website: {
    type: new DataTypes.STRING(userFieldLengths.website.max),
    set (value: string) {
      this.setDataValue('website', value.trim());
    }
  }
},
{
  sequelize,
  tableName: 'users'
});

export {
  User
};
