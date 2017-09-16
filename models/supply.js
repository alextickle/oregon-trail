module.exports = function(sequelize, DataTypes) {
  const Supply = sequelize.define('Supply', {
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    quantity: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  });

  Supply.associate = function(models) {
    Supply.belongsTo(models.Game, {
      foreignKey: 'gameId',
      onDelete: 'CASCADE'
    });
  };

  Supply.randomizeQuantities = function() {
    const quantities = [];
    // wheels (3-6)
    quantities.push(Math.floor(Math.random() * 4 + 3));
    // axles (2-5)
    quantities.push(Math.floor(Math.random() * 4 + 2));
    // tongues (2-3)
    quantities.push(Math.floor(Math.random() * 2 + 3));
    // sets of clothes (6-12)
    quantities.push(Math.floor(Math.random() * 7 + 6));
    // oxen (2-5)
    quantities.push(Math.floor(Math.random() * 4 + 2));
    // food (200-299)
    quantities.push(Math.floor(Math.random() * 100 + 200));
    // bullets (120-214)
    quantities.push(Math.floor(Math.random() * 75 + 120));
    return quantities;
  };

  Supply.initializeSupplies = function(gameId) {
    const supplyNames = [
      'wheels',
      'axles',
      'tongues',
      'sets of clothing',
      'oxen',
      'food',
      'bullets'
    ];
    const quantities = Supply.randomizeQuantities();
    const suppliesToWrite = [];
    for (let i = 0; i < 7; i++) {
      suppliesToWrite.push({
        name: supplyNames[i],
        quantity: quantities[i],
        gameId: gameId
      });
    }
    return Supply.bulkCreate(suppliesToWrite);
  };

  return Supply;
};
