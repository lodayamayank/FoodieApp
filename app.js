var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var bodyParser = require('body-parser');
const router = express.Router();
var session = require('express-session');
var async = require("async");
var moment =require("moment");
var uuid = require("uuid")
var passport = require("passport")
var LocalStrategy = require('passport-local').Strategy;
var cors = require("cors")
const environment = process.env.NODE_ENV;
var mongoose = require("mongoose");
const helmet = require("helmet")
var xssFilter = require("xssfilter");
var xssfilter = new xssFilter();
var mongodbUri = require('mongodb-uri');
var config = require("./config/config");
var debug = require('debug')('blue-butterfly-admin:server');
var http = require('http');
var fs = require("fs");


var mongouri = config.commonObjects.dbConnectionUri;
var connectionOption = {
  socketTimeoutMS: 0,
  keepAlive: true,
  reconnectTries: 30,
  useNewUrlParser: true
};
var connection = mongoose.createConnection(mongouri, connectionOption);

var app = express();

var gConfig = {};
gConfig.async = async;
gConfig.moment = moment;






app.use(cors());
app.use(helmet());

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: false
}));

app.use(session({
  secret: config.commonObjects.sessionSecretKey,
  resave: false,
  store: this.store,
  saveUninitialized: true,
  cookie: { secure: true, maxAge: 60000 }, 
  rolling: true
}))

app.use(passport.initialize());
app.use(passport.session());

var port = process.env.PORT || 3000;
app.set('port', port);

http.createServer(app);

/**
 * Listen on provided port, on all network interfaces.
 */

app.listen(port);
// app.on('error', onError);
// app.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);

  if (isNaN(port)) {
    // named pipe
    return val;
  }

  if (port >= 0) {
    // port number
    return port;
  }

  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = app.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  debug('Listening on ' + bind);
}


passport.serializeUser(function(user, done) {
  done(null, user._id);
});
 
passport.deserializeUser(function(id, done) {
  gConfig.Usermanagement.findById(id, function(err, user) {
    done(err, user);
  });
});

route = require('./commonLib/models/appConfig')(connection, gConfig);
route = require('./commonLib/auth')(gConfig);
// require('./routes/sellerLogin')(app);
// require('./routes/usersignup')(app);
// require('./routes/sellerDashboard')(app);



var condition = {};
condition.appId = config.commonObjects.appId;

gConfig.AppConfigSchema.findOne(condition).exec(function (err, resSchema) {
  if (err) {
    console.log(err)
  } else {
    gConfig.async.eachSeries(resSchema.modelFiles, function (modelName, modelCallback) {
      // var mongouri = config.commonObjects.dbConnectionUri;
      // var connectionOption = {
      //   socketTimeoutMS: 0,
      //   keepAlive: true,
      //   reconnectTries: 30,
      //   useNewUrlParser: true
      // };
      // var connection = mongoose.createConnection(mongouri, connectionOption);
      var fileName = './models/' + modelName.name + ".js";
      if (fs.existsSync(fileName)) {
        require('./models/' + modelName.name)(connection, gConfig);
        console.log("Model loaded " + modelName.name)
      }
      setImmediate(modelCallback);
    }, function () {
      gConfig.async.eachSeries(resSchema.routeFiles, function (routeName, routeCallback) {
        var fileName = './routes/' + routeName.name + ".js";
        if (fs.existsSync(fileName)) {
          require('./routes/' + routeName.name)(app, gConfig, passport, LocalStrategy);
          console.log("Route loaded " + routeName.name)
        }
        setImmediate(routeCallback);
      }, function () {
        console.log("Application loaded");

        app.use(router);

        // catch 404 and forward to error handler
        app.use(function (req, res, next) {
          if (!req.session.user) {
            req.session.user = ''
          }
          next(createError(404));
        });


        // error handler
        app.use(function (err, req, res, next) {
          // set locals, only providing error in development
          res.locals.message = err.message;
          res.locals.error = req.app.get('env') === 'development' ? err : {};

          // render the error page
          res.status(err.status || 500);
          res.render('error');
        });


      })
    })
  }
})


// app.use('/', indexRouter);
// app.use('/users', usersRouter);

