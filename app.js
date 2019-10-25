var express = require('express');
var path = require('path');
var logger = require('morgan');
var cors = require('cors');

var router = require('./routes/router');

var app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/poc', router);

module.exports = app;