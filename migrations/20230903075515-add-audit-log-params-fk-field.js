'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('audit_logs', 'paramsId', {
      type: Sequelize.INTEGER.UNSIGNED,
      references: {
        model: 'calculator_params',
        key: 'id'
      },
      after: 'userId'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('audit_logs', 'paramsId');
  }
};
