module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'Supplies',
      [
        {
          name: 'wheels',
          quantity: 4,
          gameId: 2,
          createdAt: '2004-10-19 10:23:54',
          updatedAt: '2004-10-19 10:23:54'
        },
        {
          name: 'axles',
          quantity: 4,
          gameId: 2,
          createdAt: '2004-10-19 10:23:54',
          updatedAt: '2004-10-19 10:23:54'
        },
        {
          name: 'tongues',
          quantity: 4,
          gameId: 2,
          createdAt: '2004-10-19 10:23:54',
          updatedAt: '2004-10-19 10:23:54'
        },
        {
          name: 'sets of clothing',
          quantity: 4,
          gameId: 2,
          createdAt: '2004-10-19 10:23:54',
          updatedAt: '2004-10-19 10:23:54'
        },
        {
          name: 'oxen',
          quantity: 4,
          gameId: 2,
          createdAt: '2004-10-19 10:23:54',
          updatedAt: '2004-10-19 10:23:54'
        },
        {
          name: 'food',
          quantity: 400,
          gameId: 2,
          createdAt: '2004-10-19 10:23:54',
          updatedAt: '2004-10-19 10:23:54'
        },
        {
          name: 'bullets',
          quantity: 100,
          gameId: 2,
          createdAt: '2004-10-19 10:23:54',
          updatedAt: '2004-10-19 10:23:54'
        }
      ],
      {}
    );
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Supplies', null, {});
  }
};
