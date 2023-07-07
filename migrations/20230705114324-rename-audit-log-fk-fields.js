'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('audit_logs', 'operator', 'operatorId');
    await queryInterface.renameColumn('audit_logs', 'user', 'userId');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('audit_logs', 'operatorId', 'operator');
    await queryInterface.renameColumn('audit_logs', 'userId', 'user');
  }
};
