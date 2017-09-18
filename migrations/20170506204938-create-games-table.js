const pushid = require('pushid');

module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Games', {
      id: {
        type: Sequelize.STRING
        allowNull: false,
        primaryKey: true,
        defaultValue: () => pushid()
      },
      broken: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      recovered: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      dead: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      sick: {
        type: Sequelize.STRING,
        allowNull: false,
        defaultValue: ''
      },
      found: {
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
      days: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      currentLocation: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      axles: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      bullets: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      clothes: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      food: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      oxen: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      tongues: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 0
      },
      wheels: {
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
