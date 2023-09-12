'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Remove the foreign key constraint
    await queryInterface.removeConstraint('calculator_params', 'calculator_params_ibfk_1');

    // Remove the index
    await queryInterface.removeIndex('calculator_params', ['userId', 'name']);

    // Recreate the foreign key constraint
    await queryInterface.addConstraint('calculator_params', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'calculator_params_ibfk_1',
      references: {
        table: 'users',  // assuming your user table is named 'Users'
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove the foreign key constraint
    await queryInterface.removeConstraint('calculator_params', 'calculator_params_ibfk_1');

    // Add the index
    await queryInterface.addIndex('calculator_params', {
      fields: ['userId', 'name'],
      unique: true
    });

    // Recreate the foreign key constraint
    await queryInterface.addConstraint('calculator_params', {
      fields: ['userId'],
      type: 'foreign key',
      name: 'calculator_params_ibfk_1',
      references: {
        table: 'users',  // assuming your user table is named 'Users'
        field: 'id'
      },
      onDelete: 'cascade',
      onUpdate: 'cascade'
    });
  }
};
