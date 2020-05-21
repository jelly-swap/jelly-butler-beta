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

import { PK_MATCH_ADDRESS } from './blockchain/utils';

export const run = (config = userConfig) => {
    new UserConfig().setUserConfig(config);

    const dbConfig = getDbConfig({
        name: config.DATABASE.ACTIVE,
        ...config.DATABASE[config.DATABASE.ACTIVE],
    });

    validateAddresses(config).then((result) => {
        if (result) {
            createConnection(dbConfig as any)
                .then(async () => {
                    getContracts();

                    await startTasks([new PriceTask(), new BalanceTask(), new InfoTask()]);

                    await createServer(config.SERVER.PORT);

                    await startHandlers();

                    await startEventListener();
                })
                .catch((error) => {
                    logError(`ERROR: ${error}`);
                });
        }
    });
};

const validateAddresses = async (config) => {
    for (const network in config.WALLETS) {
        const { ADDRESS, SECRET } = config.WALLETS[network];

        if (ADDRESS && SECRET) {
            const result = await PK_MATCH_ADDRESS[network](SECRET, ADDRESS);

            if (!result) {
                logError(
                    `The SECRET you have provided for ${network} network does not match the ADDRESS.
                    \r\n${SECRET} does not match ${ADDRESS}.
                    \r\nFix the problem and start Butler again.`
                );

                return false;
            }
        }
    }

    return true;
};
