'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('users', 'mode', {
      type: Sequelize.STRING,
      defaultValue: 'METOS',
      after: 'password'
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('users', 'mode');
  }
};
