const pushid = require('pushid');

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Travelers', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
        defaultValue: () => pushid()
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      status: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      disease: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      gameId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Travelers');
  }
};
