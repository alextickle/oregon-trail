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

  Traveler.initializeTravelers = function(nameObj, gameId) {
    const membersToWrite = [];
    for (let prop in nameObj) {
      membersToWrite.push({
        name: nameObj[prop],
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

  Traveler.prototype.checkRecovery = function(chance) {
    let randomNum = Math.floor(Math.random() * chance) + 1;
    if (randomNum === 1) {
      this.disease = 'none';
      this.status = 'well';
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

  Traveler.prototype.checkIfDead = function() {
    if (this.status == 'sick') {
      switch (this.disease) {
        case 'dysentery':
          if (Traveler.takeChance(2)) {
            return true;
          }
          break;
        case 'cholera':
          if (Traveler.takeChance(2)) {
            return true;
          }
          break;
        case 'broken leg':
          if (Traveler.takeChance(20)) {
            return true;
          }
          break;
        case 'broken arm':
          if (Traveler.takeChance(100)) {
            return true;
          }
          break;
        case 'bitten by snake':
          if (Traveler.takeChance(3)) {
            return true;
          }
          break;
        case 'influenza':
          if (Traveler.takeChance(50)) {
            return true;
          }
          break;
        default:
          break;
      }
    }
    return false;
  };

  return Traveler;
};
