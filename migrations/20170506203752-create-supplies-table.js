const pushid = require('pushid');

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Supplies', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        defaultValue: () => pushid()
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      gameId: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      createdAt: {
        type: Sequelize.DATE
        allowNull: false,

      },
      updatedAt: {
        type: Sequelize.DATE
        allowNull: false
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Supplies');
  }
};
