'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RequestLogs', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      operation: {
        type: Sequelize.STRING
      },
      requestId: {
        type: Sequelize.STRING
      },
      appUserHash: {
        type: Sequelize.STRING
      },
      apiUser: {
        type: Sequelize.INTEGER
      },
      tags: {
        type: Sequelize.JSON
      },
      args: {
        type: Sequelize.JSON
      },
      status: {
        type: Sequelize.STRING,        
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('RequestLogs');
  }
};