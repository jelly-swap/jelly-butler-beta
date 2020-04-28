import AppConfig from '../config';

import 'reflect-metadata';
import { createConnection } from 'typeorm';

import createServer from './server';
import { startTasks } from './server/utils';

import PriceTask from './components/price/task';
import BalanceTask from './components/balance/task';
import InfoTask from './components/info/task';

import { startHandlers } from './blockchain/handler';

import { logError } from './logger';
import { startEventListener } from './blockchain/contracts';

const validateConfig = () => {
    for (const network of Object.keys(AppConfig.NETWORKS)) {
        if (AppConfig.NETWORKS[network]) {
            if (!AppConfig.BLOCKCHAIN[network]) {
                logError(`CONFIG: Please specify ${network} Network settings - Address and Private Key.`);
                process.exit(1);
            }

            if (!AppConfig.BLOCKCHAIN[network].ADDRESS) {
                logError(`CONFIG: Please specify ${network} ADDRESS`);
                process.exit(1);
            }

            if (!AppConfig.BLOCKCHAIN[network].SECRET) {
                logError(`CONFIG: Please specify ${network} SECRET`);
                process.exit(1);
            }
        }
    }

    if (AppConfig.EXCHANGE === 'binance') {
        if (!AppConfig.BINANCE.API_KEY) {
            logError('CONFIG: Please specify Binance API KEY.');
            process.exit(1);
        }

        if (!AppConfig.BINANCE.SECRET_KEY) {
            logError('CONFIG: Please specify Binance SECRET KEY.');
            process.exit(1);
        }
    }

    if (!AppConfig.MONGODB) {
        logError('CONFIG: Please specify MONGODB settings.');
        process.exit(1);
    }

    if (!AppConfig.MONGODB.URL) {
        logError('CONFIG: Please specify MONGODB URL settings.');
        process.exit(1);
    }

    if (!AppConfig.MONGODB.AUTH) {
        logError('CONFIG: Please specify MONGODB AUTH settings.');
        process.exit(1);
    }

    if (!AppConfig.NAME) {
        logError('CONFIG: Please specify NAME.');
        process.exit(1);
    }

    if (!AppConfig.NETWORKS) {
        logError('CONFIG: Please specify NETWORKS.');
        process.exit(1);
    }

    if (!AppConfig.PAIRS) {
        logError('CONFIG: Please specify PAIRS.');
        process.exit(1);
    }

    if (!AppConfig.PRICE) {
        logError('CONFIG: Please specify PRICE.');
        process.exit(1);
    }

    return true;
};

if (validateConfig()) {
    createConnection()
        .then(async () => {
            await startTasks([new PriceTask(), new BalanceTask(), new InfoTask()]);

            await createServer(AppConfig.SERVER.PORT);

            await startHandlers();

            await startEventListener();
        })
        .catch(error => {
            logError(`ERROR: ${error}`);
        });
}
