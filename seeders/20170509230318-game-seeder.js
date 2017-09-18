module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'Games',
      [
        {
          id: '-KtximVGkLwYi9IuYYWU',
          broken: '',
          recovered: '',
          dead: '',
          sick: '',
          found: '',
          loseReason: '',
          step: '',
          message: '',
          brokenDown: false,
          days: 0,
          currentLocation: 0,
          axles: 0,
          bullets: 0,
          clothes: 0,
          food: 0,
          oxen: 0,
          tongues: 0,
          wheels: 0,
          createdAt: '2017-09-17 10:23:54',
          updatedAt: '2017-09-17 10:23:54'
        }
      ],
      {}
    );
  },

  down: function(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('Games', null, {});
  }
};
