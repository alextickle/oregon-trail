module.exports = function(sequelize, DataTypes) {
  const Supply = sequelize.define('Supply', {
    name: DataTypes.STRING,
    quantity: DataTypes.INTEGER
  });
  Supply.associate = fusnction(models) {
    Supply.belongsTo(models.Game, {
      foreignKey: 'gameId',
      onDelete: 'CASCADE'
    });
  };
  return Supply;
};
