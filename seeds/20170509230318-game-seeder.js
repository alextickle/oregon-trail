'use strict';

module.exports = {
	up: function(queryInterface, Sequelize) {
		return queryInterface.bulkInsert(
			'Games',
			[
				{
					recentlyBroken: 'h',
					recentlyRecovered: 'h',
					recentlyDeceased: 'h',
					recentlyFellIll: 'h',
					recentlyFound: 'h',
					loseReason: 'h',
					brokenDown: false,
					daysSpent: 0,
					currentLocation: 0,
					createdAt: '2004-10-19 10:23:54',
					updatedAt: '2004-10-19 10:23:54'
				}
			],
			{}
		);
	},

	down: function(queryInterface, Sequelize) {
		/*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
	}
};
