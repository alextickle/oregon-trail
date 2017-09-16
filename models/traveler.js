module.exports = function(sequelize, DataTypes) {
  const traveler = sequelize.define('Traveler', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    disease: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    }
  });

  Traveler.associate = function(models) {
    Traveler.belongsTo(models.Game, {
      foreignKey: 'gameId',
      onDelete: 'CASCADE'
    });
  };

  Traveler.initializeTravelers = function(nameObj, gameId) {
    const membersToWrite = [];
    for (let prop in nameObj) {
      membersToWrite.push({
        name: nameObj[prop],
        status: 'well',
        disease: 'none',
        gameId: gameId
      });
    }
    return Traveler.bulkCreate(membersToWrite);
  };

  return Traveler;
};
