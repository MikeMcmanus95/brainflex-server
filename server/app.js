const express = require('express');
const app = express();
const morgan = require('morgan');
const session = require('express-session');
const passport = require('passport');
const compression = require('compression');
const bodyParser = require('body-parser');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const db = require('./db/index');
// const path = require('path');

const PORT = process.env.PORT || 1337;
const sessionStore = new SequelizeStore({ db });

module.exports = app;

// Global Mocha hook, used for resource cleanup. //
if (process.env.NODE_ENV === 'test') {
  after('close the session store', () => sessionStore.stopExpiringSessions());
}

if (process.env.NODE_ENV !== 'production') require('../secrets');

// Passport registration //
passport.serializeUser((user, done) => done(null, user.id));

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.models.user.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

const createApp = () => {
  // Logging middleware //
  app.use(morgan('dev'));
  // Body-parsing middleware //
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  // Compression middleware //
  app.use(compression());

  // Static file serving middleware. Uncomment this when ready. //
  // app.use(express.static(path.join(__dirname, '..', 'public')));

  // Sends our index.html. Uncomment when ready. //
  // app.get('*', (req, res) => {
  //   res.sendFile(path.join(__dirname, '../public/index.html'));
  // });

  // Session middleware //
  app.use(
    session({
      secret: process.env.SESSION_SECRET || 'a wildly insecure secret',
      store: sessionStore,
      resave: false,
      saveUninitialized: false,
    })
  );

  // Initialize passport //
  app.use(passport.initialize());
  app.use(passport.session());

  // Auth and API routes //
  app.use('/auth', require('./auth'));
  app.use('/api', require('./api'));

  // Error handling middleware //
  app.use((err, req, res, next) => {
    console.error(err);
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal server error.');
  });
};

const startListening = () => {
  // Start listening (and create a 'server' object representing our server)
  app.listen(PORT, () => console.log(`Mixing it up on port ${PORT}`));
};

const syncDb = () => db.sync();

function bootApp() {
  sessionStore.sync();
  syncDb();
  createApp();
  startListening();
}

// This evaluates as true when this file is run directly from the command line,
// i.e. when we say 'node server/index.js' (or 'nodemon server/index.js', or 'nodemon server', etc)
// It will evaluate false when this module is required by another module - for example,
// if we wanted to require our app in a test spec
if (require.main === module) {
  bootApp();
} else {
  createApp();
}
