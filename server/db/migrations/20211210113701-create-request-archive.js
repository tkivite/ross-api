'use strict';
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('RequestArchives', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      apiUser: {
        type: Sequelize.INTEGER
      },
      apiUserHash: {
        type: Sequelize.STRING
      },
      requestId: {
        type: Sequelize.STRING
      },
      operation: {
        type: Sequelize.STRING
      },
      tags: {
        type: Sequelize.JSON
      },
      args: {
        type: Sequelize.JSON
      },
      status: {
        type: Sequelize.STRING
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
    await queryInterface.dropTable('RequestArchives');
  }
};