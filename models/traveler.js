module.exports = function(sequelize, DataTypes) {
  const traveler = sequelize.define('Traveler', {
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
    { name: 'dysentery', chance: 20 },
    { name: 'broken leg', chance: 80 },
    { name: 'broken arm', chance: 60 },
    { name: 'bitten by snake', chance: 100 },
    { name: 'influenza', chance: 20 }
  ];

  Traveler.takeChance = chance => Math.floor(Math.random() * chance) === 0;

  Traveler.prototype.checkIfDead = function(chance) {
    let randomNum = Math.floor(Math.random() * chance) + 1;
    if (randomNum === 1) {
      this.status = 'dead';
      return true;
    }
    return false;
  };

  Traveler.prototype.checkSick = function() {
    const diseases = Traveler.getDiseases();
    diseases.forEach(disease => {
      if (Traveler.takeChance(disease.chance)) {
        this.status = 'sick';
        this['disease'] = disease.name;
        return true;
      }
    });
  };

  Traveler.prototype.checkIfRecovered = function() {
    switch (this.disease) {
      case 'dysentery':
        if (Traveler.takeChance(4)) {
          this.disease = 'none';
          this.status = 'well';
          return true;
        }
        break;
      case 'cholera':
        if (Traveler.takeChance(20)) {
          this.disease = 'none';
          this.status = 'well';
          return true;
        }
        break;
      case 'broken leg':
        if (Traveler.takeChance(5)) {
          this.disease = 'none';
          this.status = 'well';
          return true;
        }
        break;
      case 'broken arm':
        if (Traveler.takeChance(3)) {
          this.disease = 'none';
          this.status = 'well';
          return true;
        }
        break;
      case 'bitten by snake':
        if (Traveler.takeChance(10)) {
          this.disease = 'none';
          this.status = 'well';
          return true;
        }
        break;
      case 'influenza':
        if (Traveler.takeChance(3)) {
          this.disease = 'none';
          this.status = 'well';
          return true;
        }
        break;
      default:
        return false;
        break;
    }
  };

  Traveler.prototype.checkIfDead = function() {
    switch (this.disease) {
      case 'dysentery':
        if (Traveler.takeChance(2)) {
          this.status = 'dead';
          return true;
        }
        break;
      case 'cholera':
        if (Traveler.takeChance(2)) {
          this.status = 'dead';
          return true;
        }
        break;
      case 'broken leg':
        if (Traveler.takeChance(20)) {
          this.status = 'dead';
          return true;
        }
        break;
      case 'broken arm':
        if (Traveler.takeChance(100)) {
          this.status = 'dead';
          return true;
        }
        break;
      case 'bitten by snake':
        if (Traveler.takeChance(3)) {
          this.status = 'dead';
          return true;
        }
        break;
      case 'influenza':
        if (Traveler.takeChance(50)) {
          this.status = 'dead';
          return true;
        }
        break;
      default:
        return false;
        break;
    }
  };

  return Traveler;
};
