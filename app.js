const express = require('express');
const path = require('path');
const logger = require('morgan');
const cors = require('cors');

const router = require('./routes/router');

const app = express();

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(cors());

app.use('/poc', router);

module.exports = app;