var express = require('express');
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var routes = require('./routes');
var cors = require('cors'); // cors takes in host and port of client

var app = express();

// Application-wide Middleware
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

// routes
app.use('/api/v1/', routes);

module.exports = app;
