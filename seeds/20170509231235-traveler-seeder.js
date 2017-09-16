module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'Travelers',
      [
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
      ],
      {}
    );
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Travelers', null, {});
  }
};
