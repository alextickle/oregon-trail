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
      },

      compare: function(a, b){
        if (a.name[0] < b.name[0]){
          return -1;
        }
        else {
          return 1;
        }
      }
    },
    instanceMethods: {
      checkBrokeDown: function(){
        var indices = [0, 3, 5, 6];
        for (var i = 0; i < indices.length; i++){
          if(this.takeChance(10)){
            this.supplies[indices[i]].quantity -= 1;
            if (this.supplies[indices[i]].quantity < 1){
              this.brokenDown = true;
            }
            this.recentlyBroken = this.supplies[indices[i]].name;
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

      checkIfDead: function(chance, partyMemberIndex){
        let i = partyMemberIndex;
        let randomNum = Math.floor(Math.random() * chance) + 1;
        if (randomNum === 1){
          this.partyMembers[i].status = "dead";
          this.recentlyDeceased = this.partyMembers[i].name;
          return true;
        }
        return false;
      },

      takeChance: function(chance){
        let randomNum = Math.floor(Math.random() * chance) + 1
        if (randomNum === 1){
          return true;
        }
        return false;
      },

      getLocations: function(){
        return [
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
      },

      getDiseases: function(){
        return [
          {name: "cholera", chance: 30},
          {name: "dysentery", chance: 20},
          {name: "broken leg", chance: 80},
          {name: "broken arm", chance: 60},
          {name: "bitten by snake", chance: 100},
          {name: "influenza", chance: 20},
          {name: "spontaneous combustion", chance: 5000}
        ];
      },

      checkSick: function(){
        let diseases = this.getDiseases();
        for (var i = 0; i < this.partyMembers.length; i++){
          if (this.partyMembers[i].status == "well"){
            for(var j = 0; j < diseases.length; j++){
                if(this.takeChance(diseases[j].chance)){
                  this.partyMembers[i].status = "sick";
                  this.partyMembers[i].disease = diseases[j].name;
                  this.recentlyFellIll = this.partyMembers[i].name;
                  return true;
                }
              }
          }
        }
        return false;
      },

      checkForDeaths: function(){
        for (var i = 0; i < this.partyMembers.length; i++){
          if (this.partyMembers[i].status == "sick"){
            switch(this.partyMembers[i].disease){
              case "dysentery":
                if (this.checkIfDead(2, i)){
                  return true;
                }
                break;
              case "cholera":
                if (this.checkIfDead(2, i)){
                  return true;
                }
                break;
              case "broken leg":
                if (this.checkIfDead(20, i)){
                  return true;
                }
                break;
              case "broken arm":
                if (this.checkIfDead(100, i)){
                  return true;
                }
                break;
              case "bitten by snake":
                if (this.checkIfDead(3, i)){
                  return true;
                }
                break;
              case "influenza":
                if (this.checkIfDead(50, i)){
                  return true;
                }
                break;
              case "spontaneous combustion":
                if (this.checkIfDead(1, i)){
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
        this.supplies.sort(compare);
        for (var i = 0; i < this.supplies.length; i++){
          if(this.found(10)){
            switch(i){
              case 0:
                this.supplies[6].quantity += 1;
                this.recentlyFound = "wagon wheel";
                break;
              case 1:
                this.supplies[0].quantity += 1;
                this.recentlyFound = "wagon axle";
                break;
              case 2:
                this.supplies[5].quantity += 1;
                this.recentlyFound = "wagon tongues";
                break;
              case 3:
                this.supplies[4].quantity += 3;
                this.recentlyFound = "sets of clothes";
                break;
              case 4:
                this.supplies[3].quantity += 1;
                this.recentlyFound = "one ox";
                break;
              case 5:
                this.supplies[2].quantity += 50;
                this.recentlyFound = "50 pounds of food";
                break;
              default:
                this.recentlyFound = "nothing";
                break;
            }
            this.daysSpent += 2;
            this.supplies[2].quantity -= (2 * this.headCount());
            return true;
          }
        }
        this.recentlyFound = "nothing";
        return false;
      },

      takeTurn: function(){
        this.supplies.sort(Game.compare);
        if (this.currentLocation === this.getLocations().length - 1){
          return {
            step: "game-won",
            message: ""
          };
        }
        if (this.checkLose()){
          return {
            step: "game-lost",
            message: ""
          };
        }
        if (this.checkForDeaths()){
          this.daysSpent += 5;
          this.supplies[2].quantity -= (2 * this.headCount());
          if (this.supplies[2].quantity < 0){
            this.supplies[2].quantity = 0;
          }
          return {
            step: "dead",
            message: ""
          };
        }
        if (this.checkRecovered()){
          return {
            step: "recovered",
            message: ""
          };
        }
        if (this.checkSick()){
          this.daysSpent += 2;
          this.supplies[2].quantity -= (1 * this.headCount());
          if (this.supplies[2].quantity < 0){
            this.supplies[2].quantity = 0;
          }
          return {
            step: "sick",
            message: ""
          };
        }
        if(this.checkBrokeDown()){
          let msg;
          switch(this.recentlyBroken){
            case "wheels":
              msg = "One wheel has broken!";
              break;
            case "axles":
              msg = "One axle has broken!";
              break;
            case "tongues":
              msg = "One wagon tongue has broken!";
              break;
            case "oxen":
              msg = "One ox has died!";
              break;
            default:
              break;
          }
          return {
            step: "broke",
            message: msg
          };
        }
        this.currentLocation++;
        this.supplies[2].quantity -= (5 * this.headCount()) ;
        if (this.supplies[2].quantity < 0){
          this.supplies[2].quantity = 0;
        }
        this.daysSpent += 10;
        return {
          step: "location",
          msg: ""
        };
      }
    }
  });
  return Game;
};
