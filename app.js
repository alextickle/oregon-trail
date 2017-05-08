let Game = require('./models').Game;
// let PartyMember = require('./models').PartyMember;
// let Supply = require ('./models').Supply;
let express = require('express');
let expressLayouts = require('express-ejs-layouts');
let app = express();
let bodyParser = require('body-parser');
let cookieParser = require('cookie-parser');

app.use(express.static('public'));
app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(expressLayouts);

app.get('/', function(request, response) {
    Game.findById(1).then(function(foundGame){
      return foundGame.load();
    }).then(function(data){
      console.log("DATA:");
      console.log(data);
    }).catch(function(){
      console.log("Error loading game");
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

app.get('/hunt', function(request, response) {
  response.render('hunt', {layout: false});
});

app.listen(3000, function(){
  console.log('listening on port 3000');
});
