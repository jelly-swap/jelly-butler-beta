import 'reflect-metadata';
import { createConnection } from 'typeorm';

import createServer from './server';
import { startTasks } from './server/utils';

import PriceTask from './components/price/task';
import BalanceTask from './components/balance/task';
import InfoTask from './components/info/task';

import { startHandlers } from './blockchain/handler';

import { logError } from './logger';
import getContracts, { startEventListener } from './blockchain/contracts';
import userConfig from '../user-config';

import getDbConfig from './config/database';
import UserConfig from './config';

export const run = (config = userConfig) => {
    new UserConfig().setUserConfig(config);

    const dbConfig = getDbConfig({
        name: config.DATABASE.ACTIVE,
        ...config.DATABASE[config.DATABASE.ACTIVE],
    });

    createConnection(dbConfig as any)
        .then(async () => {
            getContracts();

            await startTasks([new PriceTask(), new BalanceTask(), new InfoTask()]);

            await createServer(config.SERVER.PORT);

            await startHandlers();

            await startEventListener();
        })
        .catch((error) => {
            console.log(error);
            logError(`ERROR: ${error}`);
        });
};
