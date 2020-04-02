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
        logger.log('info', `${msg}: ${JSON.stringify(data)}`);
    } else {
        logger.log('info', msg);
    }
};

export const logError = (msg, data?) => {
    if (data) {
        logger.log('error', `${msg}: ${JSON.stringify(data)}`);
    } else {
        logger.log('error', msg);
    }
};
