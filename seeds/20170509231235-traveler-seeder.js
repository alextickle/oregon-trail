module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'Travelers',
      [
        {
          id: '-KtximVGkLwYi9IuYYWU',
          name: 'Alex',
          status: 'well',
          disease: 'none',
          gameId: '-KtximVGkLwYi9IuYYWU',
          createdAt: '2004-10-19 10:23:54',
          updatedAt: '2004-10-19 10:23:54'
        },
        {
          id: '-Ktxgg64pPV4TYWY8Dmi',
          name: 'Melissa',
          status: 'well',
          disease: 'none',
          gameId: '-KtximVGkLwYi9IuYYWU',
          createdAt: '2004-10-19 10:23:54',
          updatedAt: '2004-10-19 10:23:54'
        },
        {
          id: '-Ktxh-yOQWQXpAFRn_6k',
          name: 'Valerie',
          status: 'well',
          disease: 'none',
          gameId: '-KtximVGkLwYi9IuYYWU',
          createdAt: '2004-10-19 10:23:54',
          updatedAt: '2004-10-19 10:23:54'
        },
        {
          id: '-KtxhKt23Y1qlHO_ydNp',
          name: 'Roy',
          status: 'well',
          disease: 'none',
          gameId: '-KtximVGkLwYi9IuYYWU',
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
