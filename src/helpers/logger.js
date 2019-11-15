const {createLogger, format, transports} = require('winston');

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
    defaultMeta: {service: 'POLYTEACH-VIDEO'},
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

module.exports = logger;
