import { transports, format } from 'winston';

const fileFormat = format.combine(
    format.timestamp(),
    format.align(),
    format.printf(
        log =>
            `${new Date(log.timestamp).toLocaleString()} ${log.level.toUpperCase()}: ${log.message}`
    )
);

const consoleFormat = format.combine(
    format.colorize(),
    format.timestamp(),
    format.align(),
    format.printf(log => `${new Date(log.timestamp).toLocaleString()} ${log.level}: ${log.message}`)
);

export default {
    exitOnError: false,
    level: 'info',
    transports: [
        new transports.Console({ format: consoleFormat }),

        new transports.File({
            filename: `${__dirname}/../../logs/combined.log`,
            format: fileFormat,
            level: 'info',
        }),

        new transports.File({
            filename: `${__dirname}/../../logs/error.log`,
            format: fileFormat,
            level: 'error',
        }),
    ],
};
