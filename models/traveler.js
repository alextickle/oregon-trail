const pushid = require('pushid');

module.exports = function(sequelize, DataTypes) {
  const Traveler = sequelize.define('Traveler', {
    id: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true,
      defaultValue: () => pushid()
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    status: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    },
    disease: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: ''
    }
  });

  Traveler.associate = function(models) {
    Traveler.belongsTo(models.Game, {
      foreignKey: 'gameId',
      onDelete: 'CASCADE'
    });
  };

  Traveler.initializeTravelers = function(names, gameId) {
    const membersToWrite = [];
    for (let prop in names) {
      membersToWrite.push({
        name: names[prop],
        status: 'well',
        disease: 'none',
        gameId: gameId
      });
    }
    return Traveler.bulkCreate(membersToWrite);
  };

  Traveler.getDiseases = () => [
    { name: 'cholera', chance: 30 },
    { name: 'dysentery', chance: 10 },
    { name: 'broken leg', chance: 70 },
    { name: 'broken arm', chance: 50 },
    { name: 'bitten by snake', chance: 90 },
    { name: 'influenza', chance: 20 }
  ];

  Traveler.takeChance = chance => Math.floor(Math.random() * chance) === 0;

  Traveler.prototype.checkSick = function() {
    let sick = false;
    const diseases = Traveler.getDiseases();
    diseases.forEach(disease => {
      let c = Traveler.takeChance(disease.chance);
      if (Traveler.takeChance(disease.chance)) {
        this.status = 'sick';
        this['disease'] = disease.name;
        sick = true;
      }
    });
    return sick;
  };

  Traveler.prototype.checkIfRecovered = function() {
    let recovered = false;
    switch (this.disease) {
      case 'dysentery':
        if (Traveler.takeChance(4)) {
          this.disease = 'none';
          this.status = 'well';
          recovered = true;
        }
        break;
      case 'cholera':
        if (Traveler.takeChance(20)) {
          this.disease = 'none';
          this.status = 'well';
          recovered = true;
        }
        break;
      case 'broken leg':
        if (Traveler.takeChance(5)) {
          this.disease = 'none';
          this.status = 'well';
          recovered = true;
        }
        break;
      case 'broken arm':
        if (Traveler.takeChance(3)) {
          this.disease = 'none';
          this.status = 'well';
          recovered = true;
        }
        break;
      case 'bitten by snake':
        if (Traveler.takeChance(10)) {
          this.disease = 'none';
          this.status = 'well';
          recovered = true;
        }
        break;
      case 'influenza':
        if (Traveler.takeChance(3)) {
          this.disease = 'none';
          this.status = 'well';
          recovered = true;
        }
        break;
      default:
        break;
    }
    return recovered;
  };

  Traveler.prototype.checkIfDead = function() {
    let dead = false;
    switch (this.disease) {
      case 'dysentery':
        if (Traveler.takeChance(2)) {
          this.status = 'dead';
          dead = true;
        }
        break;
      case 'cholera':
        if (Traveler.takeChance(2)) {
          this.status = 'dead';
          dead = true;
        }
        break;
      case 'broken leg':
        if (Traveler.takeChance(20)) {
          this.status = 'dead';
          dead = true;
        }
        break;
      case 'broken arm':
        if (Traveler.takeChance(100)) {
          this.status = 'dead';
          dead = true;
        }
        break;
      case 'bitten by snake':
        if (Traveler.takeChance(3)) {
          this.status = 'dead';
          dead = true;
        }
        break;
      case 'influenza':
        if (Traveler.takeChance(50)) {
          this.status = 'dead';
          dead = true;
        }
        break;
      default:
        break;
    }
    return dead;
  };

  return Traveler;
};
