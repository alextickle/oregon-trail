module.exports = function(sequelize, DataTypes) {
  const PartyMember = sequelize.define('PartyMember', {
    name: DataTypes.STRING,
    status: DataTypes.STRING,
    disease: DataTypes.STRING
  });
  PartyMember.associate = function(models) {
    PartyMember.belongsTo(models.Game, {
      foreignKey: 'gameId',
      onDelete: 'CASCADE'
    });
  };
  return PartyMember;
};
