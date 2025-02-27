const config = require('./config.js');

// import libraries
const path = require('path');
const express = require('express');
const compression = require('compression');
const favicon = require('serve-favicon');
const cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const expressHandlebars = require('express-handlebars');
const session = require('express-session');
const RedisStore = require('connect-redis')(session);
const redis = require('redis');

mongoose.connect(config.connections.mongo, (err) => {
  if (err) {
    console.log('Could not connect to database');
    throw err;
  }
});

const redisClient = redis.createClient({
  legacyMode: true,
  url: config.connections.redis,
});
redisClient.connect().catch(console.error);


// pull in our routes
const router = require('./router.js');

const app = express();
app.use('/assets', express.static(
  path.resolve(config.staticAssets.path)));
app.use(compression());
app.use(bodyParser.urlencoded({
  extended: true,
}));

app.use(session({
  key: 'sessionid',
  store: new RedisStore({
    client: redisClient,
  }),
  secret: config.secret,
  resave: true,
  saveUninitialized: true,
  cookie: {
    httpOnly: true,
  },
}));

app.engine('handlebars', expressHandlebars.engine({ defaultLayout: '' }));
app.set('view engine', 'handlebars');
app.set('views', `${__dirname}/../views`);
app.use(favicon(path.resolve(`${__dirname}/../client/img/favicon.png`)));
app.use(cookieParser());

router(app);

app.listen(config.connections.http.port, (err) => {
  if (err) {
    throw err;
  }
  console.log(`Listening on port ${port}`);
});
