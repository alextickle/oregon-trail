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
      populateLocationsDiseases: function(){
        this.locations = [
          { name: "Chimney Rock",
            source: "/images/chimney-rock.jpg"},
          { name: "Fort Laramie",
            source: "/images/fort-laramie.jpg"},
          { name: "Independence Rock",
            source: "/images/independence-rock.jpg"},
          { name: "Kansas River Crossing",
            source: "/images/kansas-river-crossing.jpg"},
          { name: "Fort Kearney",
            source: "/images/fort-kearney.jpg"},
          { name: "South Pass",
            source: "/images/south-pass.jpg"},
          { name: "Green River Crossing",
            source: "/images/green-river-crossing.jpg"},
          { name: "Fort Boise",
            source: "/images/fort-boise.jpg"},
          { name: "Blue Mountains",
            source: "/images/blue-mountains.jpg"},
          { name: "The Dalles",
            source: "/images/the-dalles.jpg"}
          ];
        this.diseases = [
          {name: "cholera", chance: 30},
          {name: "dysentery", chance: 20},
          {name: "broken leg", chance: 80},
          {name: "broken arm", chance: 60},
          {name: "bitten by snake", chance: 100},
          {name: "influenza", chance: 20},
          {name: "spontaneous combustion", chance: 5000}
        ];
      },

      checkBrokeDown: function(){
        for (var i = 0; i < 4; i++){
          if(this.getBroke(10)){
            this.loadedSupplies[i].quantity -= 1;
            if (this.loadedSupplies[i].quantity < 0){
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
        if (this.loadedSupplies[2].quantity <= 0){
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
        this.loadedPartyMembers.forEach(function(member){
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
          this.loadedPartyMembers[i].disease = "none";
          this.loadedPartyMembers[i].status = "well";
          this.recentlyRecovered = this.loadedPartyMembers[i].name;
          return true;
        }
      },

      die: function(chance, partyMemberIndex){
        let i = partyMemberIndex;
        let randomNum = Math.floor(Math.random() * chance) + 1;
        if (randomNum === 1){
          this.loadedPartyMembers[i].status = "dead";
          this.recentlyDeceased = this.loadedPartyMembers[i].name;
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
        for (var i = 0; i < this.loadedPartyMembers.length; i++){
          if (this.loadedPartyMembers[i].status == "well"){
            for(var j=0; j < this.diseases.length; j++){
                if(this.getSick(this.diseases[j].chance)){
                  this.loadedPartyMembers[i].status = "sick";
                  this.loadedPartyMembers[i].disease = this.diseases[j].name;
                  this.recentlyFellIll = this.loadedPartyMembers[i];
                  return true;
                }
              }
          }
        }
        return false;
      },

      checkDead: function(){
        for (var i = 0; i < this.loadedPartyMembers.length; i++){
          if (this.loadedPartyMembers[i].status == "sick"){
            switch(this.loadedPartyMembers[i].disease){
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
        for (var i = 0; i < this.loadedPartyMembers.length; i++){
          if (this.loadedPartyMembers[i].status == "sick"){
            switch(this.loadedPartyMembers[i].disease){
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
        for (var i = 0; i < this.loadedSupplies.length; i++){
          if(this.found(10)){
            switch(i){
              case 0:
                this.loadedSupplies[0].quantity += 1;
                this.recentlyFound = "wagon wheel";
                break;
              case 1:
                this.loadedSupplies[1].quantity += 1;
                this.recentlyFound = "wagon axle";
                break;
              case 2:
                this.loadedSupplies[2].quantity += 1;
                this.recentlyFound = "wagon tongues";
                break;
              case 3:
                this.loadedSupplies[3].quantity += 3;
                this.recentlyFound = "sets of clothes";
                break;
              case 4:
                this.loadedSupplies[4].quantity += 1;
                this.recentlyFound = "one ox";
                break;
              case 5:
                this.loadedSupplies[5].quantity += 50;
                this.recentlyFound = "50 pounds of food";
                break;
              default:
                this.recentlyFound = "nothing";
                break;
            }
            this.daysSpent += 2;
            this.loadedSupplies[5].quantity -= (2 * this.headCount());
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
