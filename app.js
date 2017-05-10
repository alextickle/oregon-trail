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

var load = function(id){
  var game;
  loadGameFromDb(id).then(function(foundGame){
    gameInstance = foundGame;
    game = foundGame.dataValues;
    game.loadedSupplies = [];
    game.loadedPartyMembers = [];
    for (var i = 0; i < game.supplies.length; i++){
      game.loadedSupplies.push(game.supplies[i].dataValues);
    }
    for (var i = 0; i < game.partyMembers.length; i++){
      game.loadedPartyMembers.push(game.partyMembers[i].dataValues);
    }
    game.populateLocationsDiseases();
    resolve(new Promise(function(resolve, reject){
        return new Promise
    }));
  }).catch(function(){
    console.log("Error loading game (outer).");
  });
}

var loadGameFromDb = function(gameId){
  return Game.findById(gameId, {include: [{
        model: Supply,
        as: 'supplies'
      },
      { model: PartyMember,
        as: 'partyMembers'}]
    });
};

var save = function(gameInst){
  gameInst.save().then(function(){
    console.log("game saved");
  }).catch(function(){
    console.log("game did NOT save properly");
  });
}

app.get('/', function(request, response) {
  response.render('home');
});

app.get('/numTravelers', function(request, response) {
  response.render('numTravelers');
});

app.post('/partyMembers', function(request, response){
  let numberTravelers = request.body.quantity;
  response.render('partyMembers', {members: numberTravelers});
});

app.post('/outset', function(request, response){
    load(2).then(function(gameInst){
    let game = gameInst.dataValues;
    response.render('outset', {game: game});
  });
});
  //create a new game with random supplies
  // var ids;
  // var game;
  // Game.create({
  //   recentlyBroken: 'h',
  //   recentlyRecovered: 'h',
  //   recentlyDeceased: 'h',
  //   recentlyFellIll: 'h',
  //   recentlyFound: 'h',
  //   loseReason: 'h',
  //   brokenDown: false,
  //   daysSpent: 0,
  //   currentLocation: 0
  // }).then(function(createdGame){
  //   id = createdGame.dataValues.id;
  // });
  //
  // console.log("after game created")
  // console.log(ids);
  // //add players to game
  // let nameObj = request.body;
  // for (var property in nameObj){
  //   PartyMember.create({
  //     name: nameObj.property,
  //     status: "well",
  //     disease: "none",
  //     gameId: id
  //   }).then(function(game){
  //   });
  // }
  //
  // // create Supply objects
  // var supplyNames = ["wheels", "axles", "tongues", "sets of clothing", "oxen", "food", "bullets"];
  // var quantities = [3, 3, 2, 10, 4, 300, 100];
  // for (var i = 0; i < 7; i++){
  //   Supply.create({
  //     name: supplyNames[i],
  //     quantity: quantities[i],
  //     gameId: id
  //   }).then(function(game){
  //   });
  // }
  //
  //   load(id).then(function(game){
  //   console.log(game);
  //   //persist this game's id by writing the game id into a cookie
  //   response.cookie('gameId', id);
  //   //display the outset page
  //   response.render('outset', {game: game});
  // }).catch(function(){
  //   console.log("error");
  // })

app.get('/location', function(request, response){
  //load the game and display current location
  let game = loadGame(request);
  response.render('location', {game: game});
});

app.get('/turn',function(request,response){
  let game = loadGame(request);
  let step = game.takeTurn();
  game.save();
  response.render(step, {game: game});
});

app.get('/look-around', function(request, response) {
  let game = loadGame(request);
  game.lookAround();
  game.save();
  response.render('look-around', {game: game});
});

app.get('/hunt', function(request, response) {
  response.render('hunt', {layout: false});
});

app.listen(3000, function(){
  console.log('listening on port 3000');
});
