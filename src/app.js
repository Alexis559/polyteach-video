const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDatadog = require('connect-datadog');
const router = require('./routes/router');

const app = express();

const dd_options = {
    'response_code': true,
    'tags': ['app:POLYTEACH-VIDEO']
};


app.use(cors());
app.use(connectDatadog(dd_options));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', router);

module.exports = app;
