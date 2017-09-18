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
    step: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    message: {
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
    let breakDown = false;
    const supplies = ['axles', 'oxen', 'tongues', 'wheels'];
    supplies.forEach(supply => {
      if (Game.takeChance(10)) {
        this[supply] -= 1;
        if (this[supply] < 1) {
          this.brokenDown = true;
        }
        this.broken = supply;
        breakDown = true;
      }
    });
    return breakDown;
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
    let lose = false;
    if (this.headCount() == 0) {
      this.loseReason = 'Your entire party is dead!';
      lose = true;
    }
    if (this.food <= 0) {
      this.loseReason = 'You ran out of food!';
      lose = true;
    }
    if (this.brokenDown) {
      this.loseReason = 'Your wagon has broken down!!';
      lose = true;
    }
    return lose;
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

  Game.prototype.getCurrentLocation = function() {
    const currentLocation = this.currentLocation;
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
    return locations[currentLocation];
  };

  Game.prototype.checkForSick = function() {
    let sick = false;
    this.travelers.forEach(traveler => {
      if (traveler.status == 'well') {
        if (traveler.checkSick()) {
          this.sick = traveler.name;
          sick = true;
        }
      }
    });
    return sick;
  };

  Game.prototype.checkForDeaths = function() {
    let death = false;
    this.travelers.forEach(traveler => {
      if (traveler.status === 'sick') {
        if (traveler.checkIfDead()) {
          this.dead = traveler.name;
        }
        death = true;
      }
    });
    return death;
  };

  Game.prototype.checkForRecovered = function() {
    let recovered = false;
    this.travelers.forEach(traveler => {
      if (traveler.status === 'sick') {
        if (traveler.checkIfRecovered()) {
          this.recovered = traveler.name;
          recovered = true;
        }
      }
    });
    return recovered;
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
      this.step = 'game-won';
      return;
    }
    if (this.checkLose()) {
      this.step = 'game-lost';
      return;
    }
    if (this.checkForDeaths()) {
      this.days += 5;
      this.food -= 2 * this.headCount();
      if (this.food < 0) {
        this.food = 0;
      }
      this.step = 'dead';
      return;
    }
    if (this.checkForRecovered()) {
      this.step = 'recovered';
      return;
    }
    if (this.checkForSick()) {
      this.days += 2;
      this.food -= 1 * this.headCount();
      if (this.food < 0) {
        this.food = 0;
      }
      this.step = 'sick';
      return;
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
      this.step = 'broke';
      this.message = msg;
      return;
    }
    this.currentLocation++;
    this.food -= 5 * this.headCount();
    if (this.food < 0) {
      this.food = 0;
    }
    this.days += 10;
    this.step = 'location';
  };

  Game.prototype.saveAll = function() {
    let id = this.id;
    let promises = [];
    let travelers = this.travelers;
    return this.save()
      .then(() => {
        promises = [];
        travelers.forEach(traveler => {
          promises.push(traveler.save());
        });
        return Promise.all(promises);
      })
      .then(() => Game.load(id));
  };

  return Game;
};
