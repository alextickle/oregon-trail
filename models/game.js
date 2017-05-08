'use strict';

module.exports = function(sequelize, DataTypes) {
  var Game = sequelize.define('Game', {
    recentlyBroken: DataTypes.STRING,
    recentlyRecovered: DataTypes.STRING,
    recentlyDeceased: DataTypes.STRING,
    recentlyFellIll: DataTypes.STRING,
    recentlyFound: DataTypes.STRING,
    loseReason: DataTypes.STRING,
    brokenDown: DataTypes.BOOLEAN,
    daysSpent: DataTypes.INTEGER,
    currentLocation: DataTypes.INTEGER
  }, {
    classMethods: {
      associate: function(models) {
        Game.hasMany(models.Supply,{
          foreignKey: 'gameId',
          as: 'supplies'
        });
        Game.hasMany(models.PartyMember,{
          foreignKey: 'gameId',
          as: 'partyMembers'
        });
      }
    },
    instanceMethods: {
      load: function(){
        let mapped;
        this.getSupplies().then(function(supplies){
          this.supplies = [];
          mapped = supplies.map(function(supply){
            return supply.get()
          });
          this.supplies = mapped;
          return this.getPartyMembers();
        }).then(function(members){
          console.log("fetching members");
          console.log(members);
          this.members = [];
          mapped = members.map(function(member){
            return member.get()
          });
          this.members = members;
          return new Promise(function(resolve, reject){
              if (this.members.length != 0){
                resolve();
              }
              else {
                reject(Error("Error"));
              }
          });
        }).then(function(){
          console.log("success");
          return new Promise(function(resolve, reject){
            resolve(this);
          });
        }).catch(function(){
          console.log("Error loading");
          return new Promise(function(resolve, reject){
            reject("error");
          });
      });
    }}
  });
  return Game;
};
