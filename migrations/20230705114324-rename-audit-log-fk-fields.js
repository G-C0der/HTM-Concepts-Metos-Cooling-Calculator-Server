'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.renameColumn('AuditLogs', 'operator', 'operatorId');
    await queryInterface.renameColumn('AuditLogs', 'user', 'userId');
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.renameColumn('AuditLogs', 'operatorId', 'operator');
    await queryInterface.renameColumn('AuditLogs', 'userId', 'user');
  }
};
