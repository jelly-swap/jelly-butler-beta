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

import { PK_MATCH_ADDRESS, compareAddress } from './blockchain/utils';
import { SECONDARY_NETWORKS } from './blockchain/config';

/*
TODO: EXECUTE THESE WHEN BUTLER IS STARTED => {
    create end point and execute these when end point is called from the client
}

await startTasks([new PriceTask(), new BalanceTask(), new InfoTask()]);

await startHandlers();

await startEventListener(config);
*/

export const run = (config = userConfig, combinedFile?: string, errorFile?: string) => {
    setLoggerConfig(combinedFile, errorFile);

    new UserConfig().setUserConfig(config);

    const dbConfig = getDbConfig({
        name: config.DATABASE.ACTIVE,
        ...config.DATABASE[config.DATABASE.ACTIVE],
    });

    createConnection(dbConfig as any)
        .then(async () => {
            await createServer(config.SERVER.PORT);

            getContracts();
        })
        .catch((error) => {
            logError(`${error}`);
            logDebug(`${error}`, JSON.stringify(error));
        });

    validateAddresses(config)
        .then((result) => {
            if (result) {
            }
        })
        .catch((error) => {
            logError(`Validate error: ${error}`);
        });
};

const validateAddresses = async (config) => {
    logData('Validating...');

    const ethAddress = config.WALLETS?.ETH?.ADDRESS;

    for (const network in config.WALLETS) {
        const { ADDRESS, SECRET } = config.WALLETS[network];

        if (network !== 'ETH' && ethAddress && SECONDARY_NETWORKS[network] && compareAddress(ethAddress, ADDRESS)) {
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
