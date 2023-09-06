'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('calculator_params', 'deletedAt', {
      type: Sequelize.DATE,
      defaultValue: null
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('calculator_params', 'deletedAt');
  }
};
