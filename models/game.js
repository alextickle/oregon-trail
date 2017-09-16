module.exports = function(sequelize, DataTypes) {
  const Game = sequelize.define('Game', {
    recentlyBroken: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    recentlyRecovered: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    recentlyDeceased: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    recentlyFellIll: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    recentlyFound: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    loseReason: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    brokenDown: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: false
    },
    daysSpent: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    currentLocation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  });

  Game.associate = function(models) {
    Game.hasMany(models.Supply, {
      foreignKey: 'gameId',
      as: 'supplies'
    });
    Game.hasMany(models.Traveler, {
      foreignKey: 'gameId',
      as: 'travelers'
    });
  };

  Game.compare = function(a, b) {
    if (a.name[0] < b.name[0]) {
      return -1;
    } else {
      return 1;
    }
  };

  Game.load = function(id) {
    return Game.findById(id, {
      include: [
        {
          model: Supply,
          as: 'supplies'
        },
        {
          model: Traveler,
          as: 'travelers'
        }
      ]
    });
  };

  Game.protoype.checkBrokeDown = function() {
    var indices = [0, 3, 5, 6];
    for (var i = 0; i < indices.length; i++) {
      if (this.takeChance(10)) {
        this.supplies[indices[i]].quantity -= 1;
        if (this.supplies[indices[i]].quantity < 1) {
          this.brokenDown = true;
        }
        this.recentlyBroken = this.supplies[indices[i]].name;
        return true;
      }
    }
    return false;
  };

  Game.protoype.checkLose = function() {
    if (this.headCount() == 0) {
      this.loseReason = 'Your entire party is dead!';
      return true;
    }
    if (this.supplies[2].quantity <= 0) {
      this.loseReason = 'You ran out of food!';
      return true;
    }
    if (this.brokenDown) {
      this.loseReason = 'Your wagon has broken down!!';
      return true;
    }
    return false;
  };

  Game.prototype.headCount = function() {
    let headCount = 0;
    this.travelers.forEach(function(member) {
      if (member.status !== 'dead') {
        headCount++;
      }
    });
    return headCount;
  };

  Game.prototype.diseaseRecovery = function(chance, travelerIndex) {
    let i = travelerIndex;
    let randomNum = Math.floor(Math.random() * chance) + 1;
    if (randomNum === 1) {
      this.travelers[i].disease = 'none';
      this.travelers[i].status = 'well';
      this.recentlyRecovered = this.travelers[i].name;
      return true;
    }
  };

  Game.prototype.checkIfDead = function(chance, travelerIndex) {
    let i = travelerIndex;
    let randomNum = Math.floor(Math.random() * chance) + 1;
    if (randomNum === 1) {
      this.travelers[i].status = 'dead';
      this.recentlyDeceased = this.travelers[i].name;
      return true;
    }
    return false;
  };

  Game.prototype.takeChance = function(chance) {
    let randomNum = Math.floor(Math.random() * chance) + 1;
    if (randomNum === 1) {
      return true;
    }
    return false;
  };

  Game.prototype.getLocations = function() {
    return [
      {
        name: 'Chimney Rock',
        source: '/images/chimney-rock.jpg'
      },
      {
        name: 'Fort Laramie',
        source: '/images/fort-laramie.jpg'
      },
      {
        name: 'Independence Rock',
        source: '/images/independence-rock.jpg'
      },
      {
        name: 'Kansas River Crossing',
        source: '/images/kansas-river-crossing.jpg'
      },
      {
        name: 'Fort Kearney',
        source: '/images/fort-kearney.jpg'
      },
      {
        name: 'South Pass',
        source: '/images/south-pass.jpg'
      },
      {
        name: 'Green River Crossing',
        source: '/images/green-river-crossing.jpg'
      },
      {
        name: 'Fort Boise',
        source: '/images/fort-boise.jpg'
      },
      {
        name: 'Blue Mountains',
        source: '/images/blue-mountains.jpg'
      },
      {
        name: 'The Dalles',
        source: '/images/the-dalles.jpg'
      }
    ];
  };

  Game.prototype.getDiseases = function() {
    return [
      { name: 'cholera', chance: 30 },
      { name: 'dysentery', chance: 20 },
      { name: 'broken leg', chance: 80 },
      { name: 'broken arm', chance: 60 },
      { name: 'bitten by snake', chance: 100 },
      { name: 'influenza', chance: 20 },
      { name: 'spontaneous combustion', chance: 5000 }
    ];
  };

  Game.prototype.checkSick = function() {
    let diseases = this.getDiseases();
    for (var i = 0; i < this.travelers.length; i++) {
      if (this.travelers[i].status == 'well') {
        for (var j = 0; j < diseases.length; j++) {
          if (this.takeChance(diseases[j].chance)) {
            this.travelers[i].status = 'sick';
            this.travelers[i].disease = diseases[j].name;
            this.recentlyFellIll = this.travelers[i].name;
            return true;
          }
        }
      }
    }
    return false;
  };

  Game.prototype.checkForDeaths = function() {
    for (var i = 0; i < this.travelers.length; i++) {
      if (this.travelers[i].status == 'sick') {
        switch (this.travelers[i].disease) {
          case 'dysentery':
            if (this.checkIfDead(2, i)) {
              return true;
            }
            break;
          case 'cholera':
            if (this.checkIfDead(2, i)) {
              return true;
            }
            break;
          case 'broken leg':
            if (this.checkIfDead(20, i)) {
              return true;
            }
            break;
          case 'broken arm':
            if (this.checkIfDead(100, i)) {
              return true;
            }
            break;
          case 'bitten by snake':
            if (this.checkIfDead(3, i)) {
              return true;
            }
            break;
          case 'influenza':
            if (this.checkIfDead(50, i)) {
              return true;
            }
            break;
          case 'spontaneous combustion':
            if (this.checkIfDead(1, i)) {
              return true;
            }
            break;
          default:
            break;
        }
      }
    }
    return false;
  };

  Game.prototype.checkRecovered = function() {
    for (var i = 0; i < this.travelers.length; i++) {
      if (this.travelers[i].status == 'sick') {
        switch (this.travelers[i].disease) {
          case 'dysentery':
            if (this.diseaseRecovery(4, i)) {
              return true;
            }
            break;
          case 'cholera':
            if (this.diseaseRecovery(20, i)) {
              return true;
            }
            break;
          case 'broken leg':
            if (this.diseaseRecovery(5, i)) {
              return true;
            }
            break;
          case 'broken arm':
            if (this.diseaseRecovery(3, i)) {
              return true;
            }
            break;
          case 'bitten by snake':
            if (this.diseaseRecovery(10, i)) {
              return true;
            }
            break;
          case 'influenza':
            if (this.diseaseRecovery(3, i)) {
              return true;
            }
            break;
          default:
            break;
        }
      }
    }
    return false;
  };

  Game.prototype.lookAround = function() {
    this.supplies.sort(Game.compare);
    for (var i = 0; i < this.supplies.length; i++) {
      if (this.takeChance(10)) {
        switch (i) {
          case 0:
            this.supplies[6].quantity += 1;
            this.recentlyFound = 'one wagon wheel.';
            break;
          case 1:
            this.supplies[0].quantity += 1;
            this.recentlyFound = 'one wagon axle.';
            break;
          case 2:
            this.supplies[5].quantity += 1;
            this.recentlyFound = 'one wagon tongue.';
            break;
          case 3:
            this.supplies[4].quantity += 3;
            this.recentlyFound = 'three sets of clothes.';
            break;
          case 4:
            this.supplies[3].quantity += 1;
            this.recentlyFound = 'one ox.';
            break;
          case 5:
            this.supplies[2].quantity += 50;
            this.recentlyFound = '50 pounds of food.';
            break;
          default:
            this.recentlyFound = 'nothing.';
            break;
        }
        this.daysSpent += 2;
        this.supplies[2].quantity -= 2 * this.headCount();
        return true;
      }
    }
    this.recentlyFound = 'nothing.';
    return false;
  };

  Game.prototype.takeTurn = function() {
    this.supplies.sort(Game.compare);
    if (this.currentLocation === this.getLocations().length - 1) {
      return {
        step: 'game-won',
        message: ''
      };
    }
    if (this.checkLose()) {
      return {
        step: 'game-lost',
        message: ''
      };
    }
    if (this.checkForDeaths()) {
      this.daysSpent += 5;
      this.supplies[2].quantity -= 2 * this.headCount();
      if (this.supplies[2].quantity < 0) {
        this.supplies[2].quantity = 0;
      }
      return {
        step: 'dead',
        message: ''
      };
    }
    if (this.checkRecovered()) {
      return {
        step: 'recovered',
        message: ''
      };
    }
    if (this.checkSick()) {
      this.daysSpent += 2;
      this.supplies[2].quantity -= 1 * this.headCount();
      if (this.supplies[2].quantity < 0) {
        this.supplies[2].quantity = 0;
      }
      return {
        step: 'sick',
        message: ''
      };
    }
    if (this.checkBrokeDown()) {
      let msg;
      switch (this.recentlyBroken) {
        case 'wheels':
          msg = 'One wheel has broken!';
          break;
        case 'axles':
          msg = 'One axle has broken!';
          break;
        case 'tongues':
          msg = 'One wagon tongue has broken!';
          break;
        case 'oxen':
          msg = 'One ox has died!';
          break;
        default:
          break;
      }
      return {
        step: 'broke',
        message: msg
      };
    }
    this.currentLocation++;
    this.supplies[2].quantity -= 5 * this.headCount();
    if (this.supplies[2].quantity < 0) {
      this.supplies[2].quantity = 0;
    }
    this.daysSpent += 10;
    return {
      step: 'location',
      msg: ''
    };
  };

  Game.prototype.saveAll = function() {
    let promises = [];
    return this.save()
      .then(function() {
        this.supplies.forEach(supply => {
          promises.push(supply.save());
        });
        return Promise.all(promises);
      })
      .then(function() {
        promises = [];
        this.travelers.forEach(traveler => {
          promises.push(traveler.save());
        });
        return Promise.all(promises);
      });
  };

  return Game;
};
