var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
require('ejs')
cors = require('cors');
// use it before all route definitions
var routes = require('./routes/index').router;

//define db 
var mongo = require('mongodb');
var monk = require('monk');
var db = monk('mongodb://ah9:ah9@ds021915.mlab.com:21915/ah9');

var app = express();

// view engine setup
app.engine('.html', require('ejs').renderFile);

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

app.use(cors({origin: '*'}));
app.use(logger('dev'));
app.use(bodyParser());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'app')));
app.disable('etag');

app.post('/saveBase64Image',function(req, res, next) {
  req.rawBody = '';
  req.setEncoding('utf8');

  req.on('data', function(chunk) { 
    req.rawBody += chunk;
  });

  req.on('end', function() {
    next();
  });
});

//db initialize
app.use(function(req,res,next){
    req.db = db;
    next();
});

app.use('/', routes);
app.use('/static', express.static('app'));

module.exports = app;

