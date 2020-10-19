import 'reflect-metadata';
import { createConnection } from 'typeorm';

import createServer from './server';
import { startTasks } from './server/utils';

import PriceTask from './components/price/task';
import BalanceTask from './components/balance/task';
import InfoTask from './components/info/task';

import { startHandlers } from './blockchain/handler';

import { setLoggerConfig, logError, logDebug, logData } from './logger';
import getContracts from './blockchain/contracts';
import startEventListener from './tracker';
import userConfig from '../user-config';

import getDbConfig from './config/database';
import UserConfig from './config';

import { PK_MATCH_ADDRESS } from './blockchain/utils';

export const run = async (config = userConfig, combinedFile?: string, errorFile?: string) => {
    try {
        setLoggerConfig(combinedFile, errorFile);

        new UserConfig().setUserConfig(config);

        const dbConfig = getDbConfig({
            name: config.DATABASE.ACTIVE,
            ...config.DATABASE[config.DATABASE.ACTIVE],
        });

        const isValid = await validateAddresses(config);

        if (isValid) {
            await createConnection(dbConfig as any);

            getContracts();

            await startTasks([new PriceTask(), new BalanceTask(), new InfoTask()]);

            await createServer(config.SERVER.PORT);

            await startHandlers();

            await startEventListener(config);

            return true;
        }

        return false;
    } catch (error) {
        logError(`${error}`);
        logDebug(`${error}`, JSON.stringify(error));
        return false;
    }
};

const validateAddresses = async (config) => {
    logData('Validating...');

    for (const network in config.WALLETS) {
        const { ADDRESS, SECRET } = config.WALLETS[network];

        if (ADDRESS && SECRET) {
            try {
                const result = await PK_MATCH_ADDRESS[network](SECRET, ADDRESS);

                if (!result) {
                    logError(
                        `The SECRET you have provided for ${network} network does not match the ADDRESS.
                    \r\n${SECRET} does not match ${ADDRESS}.
                    \r\nFix the problem and start Butler again.`
                    );

                    return false;
                }
            } catch (error) {
                logError(`Invalid Address or Private Key for ${network} network.`);
                return false;
            }
        }
    }

    return true;
};
