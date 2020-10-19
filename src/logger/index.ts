import { transports, createLogger, Logger } from 'winston';
import { Config, consoleFormat, fileFormat } from './config';

let logger: Logger;

export const setLoggerConfig = (combinedFile?: string, errorFile?: string) => {
    logger = createLogger({
        exitOnError: false,
        levels: Config.levels,
        transports: [
            new transports.Console({ format: consoleFormat }),

            new transports.File({
                filename: combinedFile || `${__dirname}/../../logs/combined.log`,
                format: fileFormat,
            }),

            new transports.File({
                filename: errorFile || `${__dirname}/../../logs/error.log`,
                format: fileFormat,
                level: 'debug',
            }),
        ],
    });
};

export const logInfo = (msg, data?) => log('info', msg, data);

export const logWarn = (msg, data?) => log('warn', msg, data);

export const logError = (msg, data?) => log('error', msg, data);

export const logDebug = (msg, data?) => log('debug', msg, data);

export const logData = (msg, data?) => log('data', msg, data);

const FORWARD_LOG_LEVEL = ['error', 'data'];

const log = (level, msg, data) => {
    if (data) {
        logger[level](`${msg} : ${JSON.stringify(data)}`);
    } else {
        logger[level](msg);

        if (process.send && FORWARD_LOG_LEVEL.includes(level)) {
            process.send({ TYPE: 'LOGGER', DATA: { level, timestamp: new Date().toLocaleString(), msg } });
        }
    }
};

export default logger;
