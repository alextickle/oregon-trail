'use strict';

module.exports = {
  up: function (queryInterface, Sequelize) {
    return queryInterface.bulkInsert('PartyMembers', [
      {
        name: 'Alex',
        status: 'well',
        disease: 'none',
        gameId: 2,
        createdAt: '2004-10-19 10:23:54',
        updatedAt: '2004-10-19 10:23:54'
      },
      {
        name: 'Melissa',
        status: 'well',
        disease: 'none',
        gameId: 2,
        createdAt: '2004-10-19 10:23:54',
        updatedAt: '2004-10-19 10:23:54'
      },
      {
        name: 'Valerie',
        status: 'well',
        disease: 'none',
        gameId: 2,
        createdAt: '2004-10-19 10:23:54',
        updatedAt: '2004-10-19 10:23:54'
      },
      {
        name: 'Roy',
        status: 'well',
        disease: 'none',
        gameId: 2,
        createdAt: '2004-10-19 10:23:54',
        updatedAt: '2004-10-19 10:23:54'
      }
  ], {});
  },

  down: function (queryInterface, Sequelize) {
    /*
      Add reverting commands here.
      Return a promise to correctly handle asynchronicity.

      Example:
      return queryInterface.bulkDelete('Person', null, {});
    */
  }
};
