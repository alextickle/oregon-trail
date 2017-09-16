const Game = require('./models').Game;
const Supply = require('./models').Supply;
const Traveler = require('./models').Traveler;

const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

app.use(express.static(__dirname + '/public'));
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.set('port', process.env.PORT || 5000);

app.get('/', (request, response) => response.render('home'));

app.get('/num-travelers', (request, response) =>
  response.render('num-travelers')
);

app.post('/travelers', (request, response) => {
  // user inputs travelers' names
  let numberTravelers = request.body.quantity;
  response.render('travelers', { members: numberTravelers });
});

app.post('/outset', (request, response) => {
  //Create new game and display supply and traveler
  let gameId;
  Game.create()
    .then(game => {
      gameId = game.id;
      Supply.initializeSupplies(gameId);
    })
    .then(() => Traveler.initializeTravelers(gameId))
    .then(() => Game.load(gameId))
    .then(game => {
      response.cookie('gameId', game.dataValues.id);
      response.render('outset', {
        game: game.dataValues,
        supplies: game.supplies,
        travelers: game.travelers
      });
    })
    .catch(error => console.log('error: ', error))
});

app.get('/location', (request, response) =>
  Game.load(request.cookies.gameId).then(game =>
    response.render('location', {
      game: game.dataValues,
      supplies: game.supplies,
      travelers: game.travelers,
      locations: game.getLocations(),
      diseases: game.getDiseases()
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
        supplies: game.supplies,
        travelers: game.travelers,
        locations: game.getLocations(),
        diseases: game.getDiseases(),
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
        supplies: game.supplies,
        travelers: game.travelers,
        locations: game.getLocations()
      })
    )
    .catch(error => console.log('error: ', error));
);

app.get('/hunt', (request, response) =>
  response.render('hunt', {
    layout: false,
    gameId: request.cookies.gameId
  }))

app.post('/post-hunt/:food/:bullets', (request, response) => {
  const food = request.params.food;
  const bullets = request.params.bullets;
  Game.load(request.cookies.gameId)
    .then(game => {
      game.supplies.sort(Game.compare);
      game.supplies[2].quantity = (parseInt(food) +
        parseInt(game.supplies[2].quantity)).toString();
      game.supplies[1].quantity = (parseInt(
        game.supplies[1].quantity
      ) - parseInt(bullets)).toString();
      return game.saveAll();
    })
    .then(game =>
      response.render('post-hunt', {
        food: food,
        bullets: bullets,
        game: game.dataValues,
        supplies: game.supplies,
        travelers: game.travelers,
        locations: game.getLocations(),
        diseases: game.getDiseases()
      });
    )
    .catch(error => console.log('error: ', error))
});

app.get('/continue', (request, response) => {
  if (request.cookies.gameId) {
    Game.load(request.cookies.gameId).then(game =>
      response.render('location', {
        game: game.dataValues,
        supplies: game.supplies,
        travelers: game.travelers,
        locations: game.getLocations(),
        diseases: game.getDiseases()
      })
    )
  } else {
    response.render('home');
  }
});

app.listen(app.get('port'), () =>
  console.log('Node app is running on port', app.get('port')));
