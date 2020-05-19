import { createLogger } from 'winston';
import Options from './options';

import { getSlackTransport } from './slack';

const logger = createLogger(Options);

const slackTransport = getSlackTransport();
if (slackTransport) {
    logger.add(getSlackTransport());
}

export const logInfo = (msg, data?) => {
    if (data) {
        if (process.send) {
            process.send(`INFO: ${msg}: ${JSON.stringify(data)}`);
        }
        logger.log('info', `${msg}: ${JSON.stringify(data)}`);
    } else {
        if (process.send) {
            process.send(`INFO: ${msg}`);
        }
        logger.log('info', msg);
    }
};

export const logError = (msg, data?) => {
    if (data) {
        if (process.send) {
            process.send(`ERROR: ${msg}: ${JSON.stringify(data)}`);
        }
        logger.log('error', `${msg}: ${JSON.stringify(data)}`);
    } else {
        if (process.send) {
            process.send(`ERROR: ${msg}`);
        }
        logger.log('error', msg);
    }
};
