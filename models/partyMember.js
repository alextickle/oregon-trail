'use strict';
module.exports = function(sequelize, DataTypes) {
  var PartyMember = sequelize.define('PartyMember', {
    name: DataTypes.STRING,
    status: DataTypes.STRING,
    disease: DataTypes.STRING
  }, {
    classMethods: {
      associate: function(models) {
        PartyMember.belongsTo(models.Game,{
          foreignKey: 'gameId',
          onDelete: 'CASCADE'
        })
      }
    }
  });
  return PartyMember;
};
