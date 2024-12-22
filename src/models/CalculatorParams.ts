import { DataTypes, Model } from 'sequelize';
import {sequelize} from './';

const SIZE_LITRES_VALUES = [40, 60, 80, 100, 150, 200, 300, 400, 500] as const;
const COOLING_MODE_VALUES = ['C2', 'C3', 'C5i'] as const;

type SizeLitres = typeof SIZE_LITRES_VALUES[number];
type CoolingMode = typeof COOLING_MODE_VALUES[number];

interface TimePowerRegenPercent {
  time: string;
  powerRegenPercent: number;
}

interface Kettle {
  sizeLitres: SizeLitres;
  coolingMode: CoolingMode;
  c3CoolingPercent?: number;
  timeUsages: {
    time: string;
    foodLitres: number;
  }[]
}

class CalculatorParams extends Model {
  public id!: number;
  public userId!: number;
  public name!: string;
  public inUse!: boolean;
  public waterLitreCHF!: number;
  public waterLitreCo2!: number;
  public kwHourCHF!: number;
  public kwHourCo2!: number;
  public iceWaterCoolingType1Count!: number;
  public iceWaterCoolingType4Count!: number;
  public cop!: number;
  public kettlePowerRegenPercents!: TimePowerRegenPercent[];
  public kettles!: Kettle[];

  // timestamps
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
  public readonly deletedAt!: Date;
}

CalculatorParams.init({
  id: {
    type: DataTypes.INTEGER.UNSIGNED,
    autoIncrement: true,
    primaryKey: true
  },
  userId: {
    type: DataTypes.INTEGER.UNSIGNED,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  name: {
    type: new DataTypes.STRING(50),
    allowNull: false,
    set (value: string) {
      this.setDataValue('name', value.trim());
    }
  },
  inUse: {
    type: new DataTypes.BOOLEAN,
    allowNull: false,
    defaultValue: false
  },
  waterLitreCHF: {
    type: new DataTypes.FLOAT,
    allowNull: false
  },
  waterLitreCo2: {
    type: new DataTypes.FLOAT,
    allowNull: false
  },
  kwHourCHF: {
    type: new DataTypes.FLOAT,
    allowNull: false
  },
  kwHourCo2: {
    type: new DataTypes.FLOAT,
    allowNull: false
  },
  iceWaterCoolingType1Count: {
    type: new DataTypes.FLOAT,
    allowNull: false
  },
  iceWaterCoolingType4Count: {
    type: new DataTypes.FLOAT,
    allowNull: false
  },
  cop: {
    type: new DataTypes.FLOAT,
    allowNull: false
  },
  kettlePowerRegenPercents: {
    type: new DataTypes.JSON,
    allowNull: false,
    defaultValue: '[{"time":"06:00","powerRegenPercent":1},{"time":"07:00","powerRegenPercent":1},{"time":"08:00","powerRegenPercent":1},{"time":"09:00","powerRegenPercent":1},{"time":"10:00","powerRegenPercent":1},{"time":"11:00","powerRegenPercent":1},{"time":"12:00","powerRegenPercent":1},{"time":"13:00","powerRegenPercent":1},{"time":"14:00","powerRegenPercent":1},{"time":"15:00","powerRegenPercent":1},{"time":"16:00","powerRegenPercent":1},{"time":"17:00","powerRegenPercent":1},{"time":"18:00","powerRegenPercent":1},{"time":"19:00","powerRegenPercent":1},{"time":"20:00","powerRegenPercent":1},{"time":"21:00","powerRegenPercent":1},{"time":"22:00","powerRegenPercent":1},{"time":"23:00","powerRegenPercent":1},{"time":"00:00","powerRegenPercent":1},{"time":"01:00","powerRegenPercent":1},{"time":"02:00","powerRegenPercent":1},{"time":"03:00","powerRegenPercent":1},{"time":"04:00","powerRegenPercent":1},{"time":"05:00","powerRegenPercent":1}]'
  },
  kettles: {
    type: new DataTypes.JSON,
    allowNull: false,
    validate: {
      isKettleListValid(kettles: any) {
        const isKettle = (obj: any): obj is Kettle => {
          // Check that value does only contain valid kettle fields
          const validKeys: Array<keyof Kettle> = ['sizeLitres', 'coolingMode', 'c3CoolingPercent', 'timeUsages'];
          for (const key in obj) {
            if (!validKeys.includes(key as keyof Kettle)) return false;
          }

          const { sizeLitres, coolingMode, c3CoolingPercent, timeUsages } = obj;
          const maxC5iCoolingPercent = 100;
          const minC5iCoolingPercent = 50;
          return (
            SIZE_LITRES_VALUES.includes(sizeLitres) &&
            COOLING_MODE_VALUES.includes(coolingMode) &&
            (!c3CoolingPercent || (
              c3CoolingPercent <= maxC5iCoolingPercent &&
              c3CoolingPercent >= minC5iCoolingPercent)
            ) &&
            timeUsages.every(
              (timeUsage: any) =>
                typeof timeUsage === 'object' &&
                /^(0[0-9]|1[0-9]|2[0-3]):00$/.test(timeUsage.time) &&
                timeUsage.foodLitres > 0 &&
                timeUsage.foodLitres <= sizeLitres
            )
          );
        };

        // Check if kettles is an actual array
        if (!Array.isArray(kettles)) throw new Error('Invalid kettle list.');

        // Check if all kettles valid
        for (const kettle of kettles) {
          if (typeof kettle !== 'object' || !isKettle(kettle)) throw new Error('Invalid kettle list.');
        }
      }
    }
  }
},
  {
  sequelize,
  tableName: 'calculator_params',
  paranoid: true,
  indexes: [
    // TODO: Conditional index does not work with MySQL
    // {
    //   fields: ['userId', 'name'],
    //   where: {
    //     deletedAt: null
    //   },
    //   unique: true
    // },
    // TODO: Conditional index does not work with MySQL
    // {
    //   fields: ['userId', 'inUse'],
    //   where: {
    //     inUse: true
    //   },
    //   unique: true
    // }
  ]
});

export {
  CalculatorParams
};
