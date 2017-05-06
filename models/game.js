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
        }),
        Game.hasMany(models.PartyMember,{
          foreignKey: 'gameId',
          as: 'partyMembers'
        }),
      },

      save(){
        // TODO
      },

      load(){
        // TODO
      },

      checkBrokeDown(){
        let allSupplies = Object.getOwnPropertyNames(this.supplies);
        for (var i = 0; i<4; i++){
          if(this.getBroke(10)){
            let selectedSupply = allSupplies[i];
            this.supplies[selectedSupply].quantity -= 1;
            if (this.supplies[selectedSupply].quantity < 0){
              this.brokenDown = true;
            }
            this.recentlyBroken = this.supplies[selectedSupply].name;
            return true;
          }
        }
        return false;
      },

      checkLose(){
        if(this.headCount() == 0){
          this.loseReason = "Your entire party is dead!";
          return true;
        }
        if (this.supplies.poundsFood.quantity <= 0){
          this.loseReason = "You ran out of food!";
          return true;
        }
        if (this.brokenDown){
          this.loseReason = "Your wagon has broken down!!";
          return true;
        }
        return false;
      },

      headCount(){
        let headCount = 0;
        this.partyMembers.forEach(function(member){
          if (member.status !== "dead"){
            headCount++;
          }
        });
        return headCount;
      },

      diseaseRecovery(chance, partyMemberIndex){
        let i = partyMemberIndex;
        let randomNum = Math.floor(Math.random() * chance) + 1;
        if (randomNum === 1){
          this.partyMembers[i].disease = "none";
          this.partyMembers[i].status = "well";
          this.recentlyRecovered = this.partyMembers[i].name;
          return true;
        }
      },

      die(chance, partyMemberIndex){
        let i = partyMemberIndex;
        let randomNum = Math.floor(Math.random() * chance) + 1;
        if (randomNum === 1){
          this.partyMembers[i].status = "dead";
          this.recentlyDeceased = this.partyMembers[i].name;
          return true;
        }
        return false;
      },

      getBroke(chance){
        //let i = partyMemberIndex
        let randomNum = Math.floor(Math.random() * chance) + 1
        if (randomNum === 1){
          return true;
        }
        return false;
      },

      found(chance){
        //let i = partyMemberIndex
        let randomNum = Math.floor(Math.random() * chance) + 1
        if (randomNum === 1){
          return true;
        }
        return false;
      },

      getSick(chance){
        //let i = partyMemberIndex
        let randomNum = Math.floor(Math.random() * chance) + 1
        if (randomNum === 1){
          return true;
        }
        return false;
      },

      checkSick(){
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

      checkDead(){
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

      checkRecovered(){
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

      lookAround(){
        let allSupplies = Object.getOwnPropertyNames(this.supplies);
        let selectedSupply;
        for (var i = 0; i < allSupplies.length; i++){
          selectedSupply = allSupplies[i];
          if(this.found(10)){
            switch(selectedSupply){
              case "poundsFood":
                this.supplies.poundsFood.quantity += 50;
                this.recentlyFound = "50 pounds of food";
                break;
              case "oxen":
                this.supplies.oxen.quantity += 1;
                this.recentlyFound = "one ox";
                break;
              case "wagonWheels":
                this.supplies.wagonWheels.quantity += 1;
                this.recentlyFound = "one wagon wheel";
                break;
              case "wagonAxels":
                this.supplies.wagonAxels.quantity += 1;
                this.recentlyFound = "one wagon axel";
                break;
              case "wagonTongues":
                this.supplies.wagonTongues.quantity += 1;
                this.recentlyFound = "one wagon tongue";
                break;
              case "setsClothing":
                this.supplies.setsClothing.quantity += 1;
                this.recentlyFound = "one set of clothing";
                break;
              default:
                this.recentlyFound = "nothing";
                break;
            }
            this.daysSpent += 2;
            this.supplies.poundsFood.quantity -= (2 * this.headCount());
            return true;
          }
        }
        this.recentlyFound = "nothing";
        return false;
      },

      takeTurn(){
        if (this.currentLocation === this.locations.length-1 ){
          return "this-won";
        }
        if (this.checkLose()){
          return "lose";
        }
        if (this.checkDead()){
          this.daysSpent += 5;
          this.supplies.poundsFood.quantity -= (2 * this.headCount());
          if (this.supplies.poundsFood.quantity < 0){
            this.supplies.poundsFood.quantity = 0;
          }
          return "dead";
        }
        if (this.checkRecovered()){
          return "recovered";
        }
        if (this.checkSick()){
          this.daysSpent += 2;
          this.supplies.poundsFood.quantity -= (1 * this.headCount());
          if (this.supplies.poundsFood.quantity < 0){
            this.supplies.poundsFood.quantity = 0;
          }
          return "sick";
        }
        if(this.checkBrokeDown()){
          return "broke";
        }
        this.currentLocation++;
        this.supplies.poundsFood.quantity -= (5 * this.headCount()) ;
        if (this.supplies.poundsFood.quantity < 0){
          this.supplies.poundsFood.quantity = 0;
        }
        this.daysSpent += 10;
        return 'location';
      };
    },
  });
  return Game;
};
