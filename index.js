let Game = require('./models').Game;
let Supply = require('./models').Supply;
let PartyMember = require('./models').PartyMember;

let express = require('express');
let expressLayouts = require('express-ejs-layouts');
let app = express();
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');

// TODO get rid of these global variables
var gameInstance;
var game;
var result;

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressLayouts);
app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 5000));

// TODO make all game methods class methods

var randomizeSupplies = function(){
  var quantities = [];
  // wheels (3-6)
  quantities.push(Math.floor(Math.random() * 4 + 3));
  // axles (2-5)
  quantities.push(Math.floor(Math.random() * 4 + 2));
  // tongues (2-3)
  quantities.push(Math.floor(Math.random() * 2 + 3));
  // sets of clothes (6-12)
  quantities.push(Math.floor(Math.random() * 7 + 6));
  // oxen (2-5)
  quantities.push(Math.floor(Math.random() * 4 + 2));
  // food (2-5)
  quantities.push(Math.floor(Math.random() * 100 + 200));
  // bullets (2-5)
  quantities.push(Math.floor(Math.random() * 75 + 120));
  return quantities;
}

var newGame = function(nameObj){
  var id;
  var game;
  var nameObj = nameObj;
  return Game.create({
    recentlyBroken: 'none',
    recentlyRecovered: 'none',
    recentlyDeceased: 'none',
    recentlyFellIll: 'none',
    recentlyFound: 'none',
    loseReason: 'none',
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
    var quantities = randomizeSupplies();
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

var loadGameFromDb = function(id){
  return Game.findById(id, {include: [{
        model: Supply,
        as: 'supplies'
      },
      { model: PartyMember,
        as: 'partyMembers'}]
    });
};

var save = function(instance){
  return Game.update({
    recentlyBroken: instance.recentlyBroken,
    recentlyRecovered: instance.recentlyRecovered,
    recentlyDeceased: instance.recentlyDeceased,
    recentlyFellIll: instance.recentlyFellIll,
    recentlyFound: instance.recentlyFound,
    loseReason: instance.loseReason,
    brokenDown: instance.brokenDown,
    daysSpent: instance.daysSpent,
    currentLocation: instance.currentLocation
  }, {
      where: {
        id: instance.id
      }
  })
  .then(function(){
      var supplies = instance.supplies;
      var promise1 = Supply.update({
        quantity: supplies[0].quantity
      }, {where: {
        gameId: instance.id,
        name: "wheels"
      }});
      var promise2 = Supply.update({
        quantity: supplies[1].quantity
      }, {where: {
        gameId: instance.id,
        name: "axles"
      }});
      var promise3 = Supply.update({
        quantity: supplies[2].quantity
      }, {where: {
        gameId: instance.id,
        name: "tongues"
      }});
      var promise4 = Supply.update({
        quantity: supplies[3].quantity
      }, {where: {
        gameId: instance.id,
        name: "sets of clothing"
      }});
      var promise5 =Supply.update({
        quantity: supplies[4].quantity
      }, {where: {
        gameId: instance.id,
        name: "oxen"
      }});
      var promise6 = Supply.update({
        quantity: supplies[5].quantity
      }, {where: {
        gameId: instance.id,
        name: "food"
      }});
      var promise7 = Supply.update({
        quantity: supplies[6].quantity
      }, {where: {
        gameId: instance.id,
        name: "bullets"
      }});
      var promises = [promise1, promise2, promise3,
                      promise4, promise5, promise6, promise7];
      return Promise.all(promises);
    })
    .then(function(){
      var partyMembers = instance.partyMembers;
      var promises = [];
      for (var i = 0; i < partyMembers.length; i++){
        promises.push(PartyMember.update({
          status: partyMembers[i].status,
          disease: partyMembers[i].disease
        }, {where: {
          gameId: instance.id,
          name: partyMembers[i].name
        }}));
      }
      return Promise.all(promises);
    })
    .then(function(){
      return new Promise(function(resolve, reject){
        resolve(instance);
      });
    })
    .catch(function(){
      console.log("game did NOT save properly");
    });
};

app.get('/', function(request, response) {
  response.render('home');
});

app.get('/numTravelers', function(request, response) {
  // user inputs number of travelers
  response.render('numTravelers');
});

app.post('/partyMembers', function(request, response){
  // user inputs party members' names
  let numberTravelers = request.body.quantity;
  response.render('partyMembers', {members: numberTravelers});
});

app.post('/outset', function(request, response){
  //Create new game and display supply and party member info
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
                                  supplies: gameInstance.supplies,
                                  partyMembers: gameInstance.partyMembers,
                                  locations: gameInstance.getLocations(),
                                  diseases: gameInstance.getDiseases()
                                });
  });
});

app.get('/turn',function(request,response){
  load(request.cookies.gameId)
  .then(function(gameInstance){
    result = gameInstance.takeTurn();
    return save(gameInstance);
  })
  .then(function(gameInstance){
    response.render(result.step, {
                            game: gameInstance.dataValues,
                            supplies: gameInstance.supplies,
                            partyMembers: gameInstance.partyMembers,
                            locations: gameInstance.getLocations(),
                            diseases: gameInstance.getDiseases(),
                            message: result.message
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
    return save(gameInstance);
  })
  .then(function(gameInstance){
    response.render('look-around', {
                                  game: gameInstance.dataValues,
                                  supplies: gameInstance.supplies,
                                  partyMembers: gameInstance.partyMembers
                                });
  })
});

app.get('/hunt', function(request, response) {
  response.render('hunt', {layout: false});
});

app.get('/continue', function(request, response) {
  if (request.cookies.gameId){
    load(request.cookies.gameId)
    .then(function(gameInstance){
      response.render('location', {
                                    game: gameInstance.dataValues,
                                    supplies: gameInstance.supplies,
                                    partyMembers: gameInstance.partyMembers,
                                    locations: gameInstance.getLocations(),
                                    diseases: gameInstance.getDiseases()
                                  });
      });
  }
  else {
    response.render('home');
  }
});

app.listen(app.get('port'), function() {
  console.log('Node app is running on port', app.get('port'));
});
