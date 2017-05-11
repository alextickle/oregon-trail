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
      getSupplyObjs: function(){
        this._supplies = this._supplies || []
        if(this._supplies.length > 0){
          return this._supplies;
        }
        else {
          for (var i = 0; i < this.supplies.length; i++){
            this._supplies[i] = this.supplies[i].get();
          }

        }
        return this._supplies;
      },

      getPartyMemberObjs: function(){
        this._partyMembers = this._partyMembers || []
        if(this._partyMembers.length > 0){
          return this._partyMembers;
        }
        else {
          for (var i = 0; i < this.partyMembers.length; i++){
            this._partyMembers[i] = this.partyMembers[i].get();
          }

        }
        return this._partyMembers;
      },

      checkBrokeDown: function(){
        for (var i = 0; i < 4; i++){
          if(this.getBroke(10)){
            this.supplies[i].quantity -= 1;
            if (this.supplies[i].quantity < 0){
              this.brokenDown = true;
            }
            this.recentlyBroken = this.supplies[i].name;
            return true;
          }
        }
        return false;
      },

      checkLose: function(){
        if(this.headCount() == 0){
          this.loseReason = "Your entire party is dead!";
          return true;
        }
        if (this.supplies[2].quantity <= 0){
          this.loseReason = "You ran out of food!";
          return true;
        }
        if (this.brokenDown){
          this.loseReason = "Your wagon has broken down!!";
          return true;
        }
        return false;
      },

      headCount: function(){
        let headCount = 0;
        this.partyMembers.forEach(function(member){
          if (member.status !== "dead"){
            headCount++;
          }
        });
        return headCount;
      },

      diseaseRecovery: function(chance, partyMemberIndex){
        let i = partyMemberIndex;
        let randomNum = Math.floor(Math.random() * chance) + 1;
        if (randomNum === 1){
          this.partyMembers[i].disease = "none";
          this.partyMembers[i].status = "well";
          this.recentlyRecovered = this.partyMembers[i].name;
          return true;
        }
      },

      die: function(chance, partyMemberIndex){
        let i = partyMemberIndex;
        let randomNum = Math.floor(Math.random() * chance) + 1;
        if (randomNum === 1){
          this.partyMembers[i].status = "dead";
          this.recentlyDeceased = this.partyMembers[i].name;
          return true;
        }
        return false;
      },

      getBroke: function(chance){
        //let i = partyMemberIndex
        let randomNum = Math.floor(Math.random() * chance) + 1
        if (randomNum === 1){
          return true;
        }
        return false;
      },

      found: function(chance){
        //let i = partyMemberIndex
        let randomNum = Math.floor(Math.random() * chance) + 1
        if (randomNum === 1){
          return true;
        }
        return false;
      },

      getSick: function(chance){
        //let i = partyMemberIndex
        let randomNum = Math.floor(Math.random() * chance) + 1
        if (randomNum === 1){
          return true;
        }
        return false;
      },

      checkSick: function(){
        for (var i = 0; i < this.partyMembers.length; i++){
          if (this.partyMembers[i].status == "well"){
            for(var j=0; j < this.diseases.length; j++){
                if(this.getSick(this.diseases[j].chance)){
                  this.partyMembers[i].status = "sick";
                  this.partyMembers[i].disease = this.diseases[j].name;
                  this.recentlyFellIll = this.partyMembers[i];
                  return true;
                }
              }
          }
        }
        return false;
      },

      checkDead: function(){
        for (var i = 0; i < this.partyMembers.length; i++){
          if (this.partyMembers[i].status == "sick"){
            switch(this.partyMembers[i].disease){
              case "dysentery":
                if (this.die(2, i)){
                  return true;
                }
                break;
              case "cholera":
                if (this.die(2, i)){
                  return true;
                }
                break;
              case "broken leg":
                if (this.die(20, i)){
                  return true;
                }
                break;
              case "broken arm":
                if (this.die(100, i)){
                  return true;
                }
                break;
              case "bitten by snake":
                if (this.die(3, i)){
                  return true;
                }
                break;
              case "influenza":
                if (this.die(50, i)){
                  return true;
                }
                break;
              case "spontaneous combustion":
                if (this.die(1, i)){
                  return true;
                }
                break;
              default:
                break;
            }
          }
        }
        return false;
      },

      checkRecovered: function(){
        for (var i = 0; i < this.partyMembers.length; i++){
          if (this.partyMembers[i].status == "sick"){
            switch(this.partyMembers[i].disease){
              case "dysentery":
                if (this.diseaseRecovery(4, i)){
                  return true;
                }
                break;
              case "cholera":
                if (this.diseaseRecovery(20, i)){
                  return true;
                }
                break;
              case "broken leg":
                if (this.diseaseRecovery(5, i)){
                  return true;
                }
                break;
              case "broken arm":
                if (this.diseaseRecovery(3, i)){
                  return true;
                }
                break;
              case "bitten by snake":
                if (this.diseaseRecovery(10, i)){
                  return true;
                }
                break;
              case "influenza":
                if (this.diseaseRecovery(3, i)){
                  return true;
                }
                break;
              default:
                break;
            }
          }
        }
        return false;
      },

      lookAround: function(){
        for (var i = 0; i < this.supplies.length; i++){
          if(this.found(10)){
            switch(i){
              case 0:
                this.supplies[0].quantity += 1;
                this.recentlyFound = "wagon wheel";
                break;
              case 1:
                this.supplies[1].quantity += 1;
                this.recentlyFound = "wagon axle";
                break;
              case 2:
                this.supplies[2].quantity += 1;
                this.recentlyFound = "wagon tongues";
                break;
              case 3:
                this.supplies[3].quantity += 3;
                this.recentlyFound = "sets of clothes";
                break;
              case 4:
                this.supplies[4].quantity += 1;
                this.recentlyFound = "one ox";
                break;
              case 5:
                this.supplies[5].quantity += 50;
                this.recentlyFound = "50 pounds of food";
                break;
              default:
                this.recentlyFound = "nothing";
                break;
            }
            this.daysSpent += 2;
            this.supplies[5].quantity -= (2 * this.headCount());
            return true;
          }
        }
        this.recentlyFound = "nothing";
        return false;
      },

      takeTurn: function(){
        if (this.currentLocation === this.locations.length-1 ){
          return "this-won";
        }
        if (this.checkLose()){
          return "lose";
        }
        if (this.checkDead()){
          this.daysSpent += 5;
          this.supplies[5].quantity -= (2 * this.headCount());
          if (this.supplies[5].quantity < 0){
            this.supplies[5].quantity = 0;
          }
          return "dead";
        }
        if (this.checkRecovered()){
          return "recovered";
        }
        if (this.checkSick()){
          this.daysSpent += 2;
          this.supplies[5].quantity -= (1 * this.headCount());
          if (this.supplies[5].quantity < 0){
            this.supplies[5].quantity = 0;
          }
          return "sick";
        }
        if(this.checkBrokeDown()){
          return "broke";
        }
        this.currentLocation++;
        this.supplies[5].quantity -= (5 * this.headCount()) ;
        if (this.supplies[5].quantity < 0){
          this.supplies[5].quantity = 0;
        }
        this.daysSpent += 10;
        return 'location';
      }
    }
  });
  return Game;
};
