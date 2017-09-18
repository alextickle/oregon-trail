module.exports = function(sequelize, DataTypes) {
  const Game = sequelize.define('Game', {
    broken: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    recovered: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    deceased: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    sick: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    found: {
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
    days: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    currentLocation: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    oxen: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    clothing: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bullets: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    wheels: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    axels: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tongues: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    food: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    }
  });

  Game.associate = models => {
    Game.hasMany(models.Traveler, {
      foreignKey: 'gameId',
      as: 'travelers'
    });
  };

  Game.load = id =>
    Game.findById(id, {
      include: [
        {
          model: Traveler,
          as: 'travelers'
        }
      ]
    });

  Game.listSupplies = () => [
    'axles',
    'bullets',
    'clothing',
    'food',
    'oxen',
    'tongues',
    'wheels'
  ];

  Game.takeChance = chance => Math.floor(Math.random() * chance) === 0;

  Game.protoype.checkBrokeDown = function() {
    const supplies = ['axles', 'oxen', 'tongues', 'wheels'];
    supplies.forEach(supply => {
      if (this.takeChance(10)) {
        this[supply] -= 1;
        if (this[supply] < 1) {
          this.brokenDown = true;
        }
        this.broken = supply;
        return true;
      }
    });
    return false;
  };

  Game.protoype.checkLose = function() {
    if (this.headCount() == 0) {
      this.loseReason = 'Your entire party is dead!';
      return true;
    }
    if (this.food <= 0) {
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
    this.travelers.forEach(member => {
      if (member.status !== 'dead') {
        headCount++;
      }
    });
    return headCount;
  };

  Game.takeChance = chance => Math.floor(Math.random() * chance) === 0;

  Game.prototype.getCurrentLocation = () => {
    const locations = [
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
    return locations[this.currentLocation];
  };

  Game.prototype.checkForSick = function() {
    travelers.forEach(traveler => {
      if (traveler.status == 'well') {
        if (traveler.checkSick()) {
          this.sick = traveler.name;
          return true;
        }
      }
    });
    return false;
  };

  Game.prototype.checkForDeaths = function() {
    this.travelers.forEach(traveler => {
      if (traveler.checkIfDead()) {
        this.dead = traveler.name;
      }
      return true;
    });
    return false;
  };

  Game.prototype.checkForRecovered = function() {
    this.travelers.forEach(traveler => {
      if (traveler.status === 'sick') {
        if (traveler.checkIfRecovered()) {
          this.recovered = traveler.name;
          return true;
        }
      }
    });
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
