import 'reflect-metadata';
import { createConnection } from 'typeorm';

import createServer from './server';
import { startTasks } from './server/utils';

import PriceTask from './components/price/task';
import BalanceTask from './components/balance/task';
import InfoTask from './components/info/task';

import { startHandlers } from './blockchain/handler';

import { logError, logInfo, setLoggerConfig } from './logger';
import getContracts, { startEventListener } from './blockchain/contracts';
import userConfig from '../user-config';

import getDbConfig from './config/database';
import UserConfig from './config';

import { PK_MATCH_ADDRESS, compareAddress } from './blockchain/utils';

export const run = (config = userConfig, combinedFile?: string, errorFile?: string) => {
    if (combinedFile && errorFile) {
        setLoggerConfig(combinedFile, errorFile);
    }

    new UserConfig().setUserConfig(config);

    const dbConfig = getDbConfig({
        name: config.DATABASE.ACTIVE,
        ...config.DATABASE[config.DATABASE.ACTIVE],
    });

    validateAddresses(config)
        .then((result) => {
            if (result) {
                createConnection(dbConfig as any)
                    .then(async () => {
                        getContracts();

                        await startTasks([new PriceTask(), new BalanceTask(), new InfoTask()]);

                        await createServer(config.SERVER.PORT);

                        await startHandlers();

                        await startEventListener(config.WALLETS);
                    })
                    .catch((error) => {
                        logError(`DB_ERROR`, error);
                    });
            }
        })
        .catch((error) => {
            logError(`Validate error: ${error}`);
        });
};

const validateAddresses = async (config) => {
    logInfo('Validating...');

    const ethAddress = config.WALLETS?.ETH?.ADDRESS;

    for (const network in config.WALLETS) {
        const { ADDRESS, SECRET } = config.WALLETS[network];

        if (network !== 'ETH' && ethAddress && compareAddress(ethAddress, ADDRESS)) {
            logError('It is not allowed to have the same wallet for ETH and any ERC20');
            return false;
        }

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
