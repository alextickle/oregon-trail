'use strict';
module.exports = function(sequelize, DataTypes) {
	var Supply = sequelize.define(
		'Supply',
		{
			name: DataTypes.STRING,
			quantity: DataTypes.INTEGER
		},
		{
			classMethods: {
				associate: function(models) {
					Supply.belongsTo(models.Game, {
						foreignKey: 'gameId',
						onDelete: 'CASCADE'
					});
				}
			}
		}
	);
	return Supply;
};
