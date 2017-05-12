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

var newGame = function(nameObj){
  var id;
  var game;
  var nameObj = nameObj;
  console.log(nameObj);
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
  }).then(function(createdGame){
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
  }).then(function(){
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
  }).then(function(){
    return load(id);
  }).catch(function(){
    console.log("error creating new game");
  });
}

var load = function(id){
  var game;
  return loadGameFromDb(id).then(function(gameInstance){
    return new Promise(function(resolve, reject){
      game = gameInstance.dataValues;
      game.supplies = gameInstance.getSupplyObjs();
      game.partyMembers = gameInstance.getPartyMemberObjs();
      populateLocationsDiseases(game);
      resolve(game);
    });
  }).catch(function(){
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
  newGame(request.body).then(function(game){
  response.cookie('gameId', game.id);
  console.log("game.id");
  console.log(game.id);
  console.log("response.cookie.gameId");
  console.log(response.cookie);
  response.render('outset', {game: game});
  });
});

app.get('/location', function(request, response){
  //load the game and display current location
  var gameId = response.cookie.gameId;
  console.log(gameId);
  load(gameId).then(function(game){
  response.render('location', {game: game});
  });
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
