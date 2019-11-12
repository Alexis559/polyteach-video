const express = require('express');
const path = require('path');
const cors = require('cors');
const {createLogger, format, transports} = require('winston');
const connectDatadog = require('connect-datadog');
const router = require('./routes/router');

const app = express();

const dd_options = {
    'response_code': true,
    'tags': ['app:APP_NAME']
};

// Logger creation
const logger = createLogger({
    level: 'info',
    format: format.combine(
        format.timestamp({
            format: 'YYYY-MM-DD HH:mm:ss'
        }),
        format.errors({stack: true}),
        format.splat(),
        format.json()
    ),
    defaultMeta: {service: 'APP_NAME'},
    transports: [
        new transports.File({filename: 'logs/test.log'})
    ]
});

// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
if (process.env.NODE_ENV !== 'production') {
    logger.add(new transports.Console({
        format: format.combine(
            format.colorize(),
            format.simple()
        )
    }));
} else {
    new transports.File({filename: 'logs/test.log'});
}

app.use(cors());
app.use(connectDatadog(dd_options));

app.use(express.json());
app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (req, res) => {
    logger.info('[Polyteach-video] A request had been received on /');
});

app.use('/poc', router);

module.exports = app;