const Game = require('./models').Game;
const Traveler = require('./models').Traveler;
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const hbs = require('express-handlebars');

// use handlebars templating
app.engine('hbs'. handlebars({extname: 'hbs', defaultLayout: 'layout', layoutsDir: __dirname + '/views/'}))
app.set('view engine', 'hbs');
hbs.registerPartial('game-status', '{{ game-status }}')

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('port', process.env.PORT || 5000);

// routes
app.get('/', (request, response) => response.render('home'));

app.get('/num-travelers', (request, response) =>
  response.render('num-travelers')
);

app.post('/travelers', (request, response) => {
  let travelers = [];
  for (let i = 0; i < request.body.quantity){
    travelers.push("traveler" + i);
  }
  response.render('travelers', { travelers })});

app.post('/outset', (request, response) => {
  let gameId;
  Game.create()
    .then(game => {
      gameId = game.id;
      Traveler.initializeTravelers(gameId))
    })
    .then(() => Game.load(gameId))
    .then(game => {
      response.cookie('gameId', game.dataValues.id);
      response.render('outset', {
        game: game.dataValues,
        travelers: game.travelers
      });
    })
    .catch(error => console.log('error: ', error))
});

app.get('/location', (request, response) =>
  Game.load(request.cookies.gameId).then(game =>
    response.render('location', {
      game: game.dataValues,
      travelers: game.travelers
    });
  )
  .catch(error => console.log('error: ', error))
);

app.get('/turn', (request, response) =>
  Game.load(request.cookies.gameId)
    .then(game => {
      result = game.takeTurn();
      return game.saveAll();
    })
    .then(game =>
      response.render(result.step, {
        game: game.dataValues,
        travelers: game.travelers,
        location: game.getCurrentLocation(),
        message: result.message
      });
    )
    .catch(error => console.log('error: ', error))
);

app.get('/look-around', (request, response) =>
  Game.load(request.cookies.gameId)
    .then(game => {
      game.lookAround();
      return Game.saveAll();
    })
    .then(game =>
      response.render('look-around', {
        game: game.dataValues,
        travelers: game.travelers,
        location: game.getCurrentLocation(),
      })
    )
    .catch(error => console.log('error: ', error));
);

app.get('/hunt', (request, response) =>
  response.render('hunt', {
    layout: false,
    gameId: request.cookies.gameId
  }))

app.post('/post-hunt/:food/:bullets', (request, response) =>
  Game.load(request.cookies.gameId)
    .then(game => {
      game.food += parseInt(request.params.food);
      game.bullets -= parseInt(request.params.bullets);
      return game.saveAll();
    })
    .then(game =>
      response.render('post-hunt', {
        food: food,
        bullets: bullets,
        location: game.getCurrentLocation()
      });
    )
    .catch(error => console.log('error: ', error))
);

app.get('/continue', (request, response) => {
  if (request.cookies.gameId) {
    Game.load(request.cookies.gameId).then(game =>
      response.render('location', {
        game: game.dataValues,
        travelers: game.travelers,
        location: game.getCurrentLocation()
      })
    )
  } else {
    response.render('home');
  }
});

app.listen(app.get('port'), () =>
  console.log('Node app is running on port', app.get('port')));
