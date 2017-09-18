module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.createTable('Games', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true
      },
      broken: {
        type: Sequelize.STRING,
        allowNull: false
      },
      recovered: {
        type: Sequelize.STRING,
        allowNull: false
      },
      dead: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sick: {
        type: Sequelize.STRING,
        allowNull: false
      },
      found: {
        type: Sequelize.STRING,
        allowNull: false
      },
      loseReason: {
        type: Sequelize.STRING,
        allowNull: false
      },
      brokenDown: {
        type: Sequelize.BOOLEAN,
        allowNull: false
      },
      days: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      currentLocation: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      axles: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      bullets: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      clothes: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      food: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      oxen: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      tongues: {
        type: Sequelize.INTEGER,
        allowNull: false
      },
      wheels: {
        type: Sequelize.INTEGER,
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
    return queryInterface.dropTable('Games');
  }
};
