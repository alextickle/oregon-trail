const pushid = require('pushid');

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Games', {
      id: {
        type: Sequelize.DATE
        allowNull: false,
        autoIncrement: false,
        primaryKey: true,
        defaultValue: () => pushid()
      },
      recentlyBroken: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      recentlyRecovered: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      recentlyDeceased: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      recentlyFellIll: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      recentlyFound: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      loseReason: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      brokenDown: {
        type: Sequelize.BOOLEAN,
        allowNull: false,
        defaultValue: false
      },
      daysSpent: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      currentLocation: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      createdAt: {
        type: Sequelize.DATE
        allowNull: false
      },
      updatedAt: {
        type: Sequelize.DATE
        allowNull: false
      }
    });
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.dropTable('Games');
  }
};
