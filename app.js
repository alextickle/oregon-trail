const Game = require('./models/Game');
const PartyMember = require('./models/PartyMember');
const Supply = require ('./models/Supply');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressLayouts);

function loadGame(request){
  let gameId = request.cookies.gameId;
  let game = new Game(gameId);
  game.load();
  return game;
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
  //create a new game with random supplies
  let game = new Game();
  //add players to game
  let nameObj = request.body;
  for (var property in nameObj){
    let traveler = new PartyMember(nameObj[property]);
    game.partyMembers.push(traveler);
  }
  //save the game
  game.save();
  //persist this game's id by writing the game id into a cookie
  response.cookie('gameId', game.id);
  //display the outset page
  response.render('outset', {game: game});
});

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

app.listen(3000, function(){
  console.log('listening on port 3000');
});
