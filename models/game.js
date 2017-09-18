const pushid = require('pushid');

module.exports = function(sequelize, DataTypes) {
  const Game = sequelize.define('Game', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: () => pushid()
    },
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
    dead: {
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
    axles: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    bullets: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    clothes: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    food: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    oxen: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    tongues: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0
    },
    wheels: {
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

  Game.load = id => {
    return Game.findById(id, {
      include: [
        {
          model: sequelize.models.Traveler,
          as: 'travelers'
        }
      ]
    });
  };

  Game.listSupplies = () => [
    'axles',
    'bullets',
    'clothes',
    'food',
    'oxen',
    'tongues',
    'wheels'
  ];

  Game.takeChance = chance => Math.floor(Math.random() * chance) === 0;

  Game.prototype.checkForBreakDown = function() {
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

  Game.prototype.initializeSupplies = function() {
    // wheels (3-6)
    this.wheels = Math.floor(Math.random() * 4 + 3);
    // axles (2-5)
    this.axles = Math.floor(Math.random() * 4 + 2);
    // tongues (2-3)
    this.tongues = Math.floor(Math.random() * 2 + 3);
    // sets of clothes (6-12)
    this.clothes = Math.floor(Math.random() * 7 + 6);
    // oxen (2-5)
    this.oxen = Math.floor(Math.random() * 4 + 2);
    // food (200-299)
    this.food = Math.floor(Math.random() * 100 + 200);
    // bullets (120-214)
    this.bullets = Math.floor(Math.random() * 75 + 120);
  };

  Game.prototype.checkLose = function() {
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
      if (traveler.status === 'sick') {
        if (traveler.checkIfDead()) {
          this.dead = traveler.name;
        }
        return true;
      }
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
    const supplies = ['axles', 'oxen', 'tongues', 'wheels', 'clothes', 'food'];
    supplies.forEach(supply => {
      if (Game.takeChance(10)) {
        switch (supply) {
          case 'wheels':
            this.wheels += 1;
            this.found = 'one wagon wheel.';
            break;
          case 'axles':
            this.axles += 1;
            this.found = 'one wagon axle.';
            break;
          case 'tongues':
            this.tongues += 1;
            this.found = 'one wagon tongue.';
            break;
          case 'clothes':
            this.clothes += 3;
            this.found = 'three sets of clothes.';
            break;
          case 'oxen':
            this.oxen += 1;
            this.found = 'one ox.';
            break;
          case 'food':
            this.food += 50;
            this.found = '50 pounds of food.';
            break;
          default:
            this.found = 'nothing.';
            break;
        }
        this.days += 2;
        this.food -= 2 * this.headCount();
        return true;
      }
      this.recentlyFound = 'nothing.';
      return false;
    });
  };

  Game.prototype.takeTurn = function() {
    if (this.getCurrentLocation().name === 'The Dalles') {
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
      this.days += 5;
      this.food -= 2 * this.headCount();
      if (this.food < 0) {
        this.food = 0;
      }
      return {
        step: 'dead',
        message: ''
      };
    }
    if (this.checkForRecovered()) {
      return {
        step: 'recovered',
        message: ''
      };
    }
    if (this.checkForSick()) {
      this.days += 2;
      this.food -= 1 * this.headCount();
      if (this.food < 0) {
        this.food = 0;
      }
      return {
        step: 'sick',
        message: ''
      };
    }
    if (this.checkForBreakDown()) {
      let msg;
      switch (this.broken) {
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
    this.food -= 5 * this.headCount();
    if (this.food < 0) {
      this.food = 0;
    }
    this.days += 10;
    return {
      step: 'location',
      msg: ''
    };
  };

  Game.prototype.saveAll = function() {
    let promises = [];
    return this.save().then(function() {
      promises = [];
      this.travelers.forEach(traveler => {
        promises.push(traveler.save());
      });
      return Promise.all(promises);
    });
  };

  return Game;
};
