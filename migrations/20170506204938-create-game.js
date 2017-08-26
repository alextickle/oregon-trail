'use strict';
module.exports = {
	up: function(queryInterface, Sequelize) {
		return queryInterface.createTable('Games', {
			id: {
				allowNull: false,
				autoIncrement: true,
				primaryKey: true,
				type: Sequelize.INTEGER
			},
			recentlyBroken: {
				type: Sequelize.STRING
			},
			recentlyRecovered: {
				type: Sequelize.STRING
			},
			recentlyDeceased: {
				type: Sequelize.STRING
			},
			recentlyFellIll: {
				type: Sequelize.STRING
			},
			recentlyFound: {
				type: Sequelize.STRING
			},
			loseReason: {
				type: Sequelize.STRING
			},
			brokenDown: {
				type: Sequelize.BOOLEAN
			},
			daysSpent: {
				type: Sequelize.INTEGER
			},
			currentLocation: {
				type: Sequelize.INTEGER
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
	down: function(queryInterface, Sequelize) {
		return queryInterface.dropTable('Games');
	}
};
