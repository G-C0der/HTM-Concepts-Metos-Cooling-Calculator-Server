'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('calculator_params', 'kettlePowerRegenPercents', {
      type: Sequelize.JSON,
      defaultValue: '[{"time":"06:00","powerRegenPercent":1},{"time":"07:00","powerRegenPercent":1},{"time":"08:00","powerRegenPercent":1},{"time":"09:00","powerRegenPercent":1},{"time":"10:00","powerRegenPercent":1},{"time":"11:00","powerRegenPercent":1},{"time":"12:00","powerRegenPercent":1},{"time":"13:00","powerRegenPercent":1},{"time":"14:00","powerRegenPercent":1},{"time":"15:00","powerRegenPercent":1},{"time":"16:00","powerRegenPercent":1},{"time":"17:00","powerRegenPercent":1},{"time":"18:00","powerRegenPercent":1},{"time":"19:00","powerRegenPercent":1},{"time":"20:00","powerRegenPercent":1},{"time":"21:00","powerRegenPercent":1},{"time":"22:00","powerRegenPercent":1},{"time":"23:00","powerRegenPercent":1},{"time":"00:00","powerRegenPercent":1},{"time":"01:00","powerRegenPercent":1},{"time":"02:00","powerRegenPercent":1},{"time":"03:00","powerRegenPercent":1},{"time":"04:00","powerRegenPercent":1},{"time":"05:00","powerRegenPercent":1}]',
      after: 'cop'
    });

    await queryInterface.sequelize.query(`
      UPDATE calculator_params
      SET kettlePowerRegenPercents = '[{"time":"06:00","powerRegenPercent":1},{"time":"07:00","powerRegenPercent":1},{"time":"08:00","powerRegenPercent":1},{"time":"09:00","powerRegenPercent":1},{"time":"10:00","powerRegenPercent":1},{"time":"11:00","powerRegenPercent":1},{"time":"12:00","powerRegenPercent":1},{"time":"13:00","powerRegenPercent":1},{"time":"14:00","powerRegenPercent":1},{"time":"15:00","powerRegenPercent":1},{"time":"16:00","powerRegenPercent":1},{"time":"17:00","powerRegenPercent":1},{"time":"18:00","powerRegenPercent":1},{"time":"19:00","powerRegenPercent":1},{"time":"20:00","powerRegenPercent":1},{"time":"21:00","powerRegenPercent":1},{"time":"22:00","powerRegenPercent":1},{"time":"23:00","powerRegenPercent":1},{"time":"00:00","powerRegenPercent":1},{"time":"01:00","powerRegenPercent":1},{"time":"02:00","powerRegenPercent":1},{"time":"03:00","powerRegenPercent":1},{"time":"04:00","powerRegenPercent":1},{"time":"05:00","powerRegenPercent":1}]'
      WHERE kettlePowerRegenPercents IS NULL
    `);
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('calculator_params', 'kettlePowerRegenPercents');
  }
};
