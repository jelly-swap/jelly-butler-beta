import { Config } from '@jelly-swap/algorand';

import { safeAccess } from '../../utils';
import UserConfig from '../../config';

export default () => {
    const userConfig = new UserConfig().getUserConfig();

    const address = safeAccess(userConfig, ['WALLETS', 'ALGO', 'ADDRESS']);
    const secret = safeAccess(userConfig, ['WALLETS', 'ALGO', 'SECRET']);

    const config = {
        ...Config(7200),
        explorer: 'https://algoexplorer.io/tx/',
        providerUrl: 'https://spacejelly.network/algo/api/v1/algo',
        REFUND_PERIOD: 10,
        VALID_EXPIRATION: 72000,
        unix: true,
    };

    if (address && secret) {
        return {
            ...config,
            receiverAddress: address,
            SEED: secret,
        };
    } else {
        throw new Error('Algorand ADDRESS and SECRET are missing.');
    }
};
