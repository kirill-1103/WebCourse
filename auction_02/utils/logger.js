const {createLogger,format,transports} = require('winston');

module.exports = createLogger({
    transports:[
        new transports.File({
            maxSize: 5120000,
            maxFiles: 5,
            filename: `${__dirname}/../logs/log.log`,
            format: format.combine(format.simple(),
                format.timestamp(),
                format.printf(info=>`[${info.timestamp}] ${info.level} ${info.message}`)),
        }),
        new transports.Console({
            level:'debug',
            colorize:true,
            prettyPrint:true,
            format: format.combine(format.simple(),format.colorize(),
                format.timestamp(),
                format.printf(info=>`[${info.timestamp}] ${info.level} ${info.message}`)),
        })
    ],
});
