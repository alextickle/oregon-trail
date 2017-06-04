let Game = require('./models').Game;
let Supply = require('./models').Supply;
let PartyMember = require('./models').PartyMember;
let express = require('express');
let expressLayouts = require('express-ejs-layouts');
let app = express();
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');
var gameInstance;
var game;

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressLayouts);

// TODO make all game methods class methods

var newGame = function(nameObj){
  var id;
  var game;
  var nameObj = nameObj;
  return Game.create({
    recentlyBroken: 'h',
    recentlyRecovered: 'h',
    recentlyDeceased: 'h',
    recentlyFellIll: 'h',
    recentlyFound: 'h',
    loseReason: 'h',
    brokenDown: false,
    daysSpent: 0,
    currentLocation: 0
  })
  .then(function(createdGame){
    id = createdGame.dataValues.id;
    var membersToWrite = [];
    for (var prop in nameObj){
      membersToWrite.push({
        name: nameObj[prop],
        status: "well",
        disease: "none",
        gameId: id
      });
    }
    return PartyMember.bulkCreate(membersToWrite);
  })
  .then(function(){
    var supplyNames = ["wheels", "axles", "tongues", "sets of clothing", "oxen", "food", "bullets"];
    var quantities = [3, 3, 2, 10, 4, 300, 100];
    var suppliesToWrite = [];
    for (var i = 0; i < 7; i++){
      suppliesToWrite.push({
        name: supplyNames[i],
        quantity: quantities[i],
        gameId: id
      });
    }
    return Supply.bulkCreate(suppliesToWrite);
  })
  .then(function(){
    console.log("game created, ID: ", id)
    return load(id);
  })
  .catch(function(){
    console.log("error creating new game");
  });
}

var load = function(id){
  return loadGameFromDb(id)
  .catch(function(){
    console.log("load failed");
  });
}

var populateLocationsDiseases = function(game){
  game.locations = [
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
  game.diseases = [
    {name: "cholera", chance: 30},
    {name: "dysentery", chance: 20},
    {name: "broken leg", chance: 80},
    {name: "broken arm", chance: 60},
    {name: "bitten by snake", chance: 100},
    {name: "influenza", chance: 20},
    {name: "spontaneous combustion", chance: 5000}
  ];
};

var loadGameFromDb = function(gameId){
  return Game.findById(gameId, {include: [{
        model: Supply,
        as: 'supplies'
      },
      { model: PartyMember,
        as: 'partyMembers'}]
    });
};

var save = function(gameId, gameInstance){
  return loadGameFromDb(gameId)
  .then(function(instance){
    return Game.update({
      recentlyBroken: game.recentlyBroken,
      recentlyRecovered: game.recentlyRecovered,
      recentlyDeceased: game.recentlyDeceased,
      recentlyFellIll: game.recentlyFellIll,
      recentlyFound: game.recentlyFound,
      loseReason: game.loseReason,
      brokenDown: game.brokenDown,
      daysSpent: game.daysSpent,
      currentLocation: game.currentLocation
    }, {
        where: {
          id: gameId
        }
      });
  })
  .then(function(){
      console.log("saving supplies");
      var supplies = game.currentSupplies;
      var promise1 = Supply.update({
        quantity: supplies[0].quantity
      }, {where: {
        gameId: gameId,
        name: "wheels"
      }});
      var promise2 = Supply.update({
        quantity: supplies[1].quantity
      }, {where: {
        gameId: gameId,
        name: "axles"
      }});
      var promise3 = Supply.update({
        quantity: supplies[2].quantity
      }, {where: {
        gameId: gameId,
        name: "tongues"
      }});
      var promise4 = Supply.update({
        quantity: supplies[3].quantity
      }, {where: {
        gameId: gameId,
        name: "sets of clothing"
      }});
      var promise5 =Supply.update({
        quantity: supplies[4].quantity
      }, {where: {
        gameId: gameId,
        name: "oxen"
      }});
      var promise6 = Supply.update({
        quantity: supplies[5].quantity
      }, {where: {
        gameId: gameId,
        name: "food"
      }});
      var promise7 = Supply.update({
        quantity: supplies[6].quantity
      }, {where: {
        gameId: gameId,
        name: "bullets"
      }});
      var promises = [promise1, promise2, promise3,
                      promise4, promise5, promise6, promise7];
      return Promise.all(promises);
    })
    .then(function(){
      var partyMembers = gameInstance.currentPartyMembers;
      var promises = [];
      for (var i = 0; i < partyMembers.length; i++){
        promises.push(PartyMember.update({
          status: partyMembers[i].status,
          disease: partyMembers[i].disease
        }, {where: {
          gameId: gameId,
          name: partyMembers[i].name
        }}));
      }
      return Promise.all(promises);
    })
    .then(function(){
      return new Promise(function(resolve, reject){
        resolve(gameInstance);
      });
    })
    .catch(function(){
      console.log("game did NOT save properly");
    });
};

app.get('/continue', function(request, response) {
  load(request.cookies.gameId)
  .then(function(gameInstance){
    response.render('outset', {
                                  game: gameInstance.dataValues,
                                  supplies: gameInstance.currentSupplies,
                                  partyMembers: gameInstance.currentPartyMembers,
                                });
    });
});

app.get('/', function(request, response) {
  response.render('home');
});

app.get('/testing', function(request, response){
    Game.findById(6).then(function(instance){
    console.log(instance);
  });
});

app.get('/numTravelers', function(request, response) {
  response.render('numTravelers');
});

app.post('/partyMembers', function(request, response){
  let numberTravelers = request.body.quantity;
  response.render('partyMembers', {members: numberTravelers});
});

app.post('/outset', function(request, response){
  newGame(request.body)
  .then(function(gameInstance){
    response.cookie('gameId', gameInstance.dataValues.id);
    response.render('outset', {
                                game: gameInstance.dataValues,
                                supplies: gameInstance.supplies,
                                partyMembers: gameInstance.partyMembers
                              });
  });
});

app.get('/location', function(request, response){
  //load the game and display current location
  load(request.cookies.gameId)
  .then(function(gameInstance){
    response.render('location', {
                                  game: gameInstance.dataValues,
                                  supplies: gameInstance.currentSupplies,
                                  partyMembers: gameInstance.currentPartyMembers,
                                });
  });
});

app.get('/turn',function(request,response){
  let step;
  load(request.cookies.gameId).then(function(gameInstance){
    // step = gameInstance.takeTurn();
    return save(request.cookies.gameId, gameInstance);
  })
  .then(function(gameInstance){
      response.render('location', {
                                    game: gameInstance.dataValues,
                                    supplies: gameInstance.currentSupplies,
                                    partyMembers: gameInstance.currentPartyMembers,
                                  });
  })
  .catch(function(){
    console.log("save failed (called from route)");
  })
});

app.get('/look-around', function(request, response) {
  load(request.cookies.gameId)
  .then(function(gameInstance){
    gameInstance.lookAround();
    return save(request.cookies.gameId, gameInstance);
  })
  .then(function(gameInstance){
    response.render('look-around', {
                                  game: gameInstance.dataValues,
                                  supplies: gameInstance.currentSupplies,
                                  partyMembers: gameInstance.currentPartyMembers,
                                });
  })
});

app.get('/hunt', function(request, response) {
  response.render('hunt', {layout: false});
});

app.listen(3000, function(){
  console.log('listening on port 3000');
});
