import { Config } from '@jelly-swap/bitcoin';
import { Networks } from '@jelly-swap/btc-utils';

import { safeAccess } from '../../utils';
import UserConfig from '../../config';

export default () => {
    const userConfig = new UserConfig().getUserConfig();

    const address = safeAccess(userConfig, ['WALLETS', 'BTC', 'ADDRESS']);
    const secret = safeAccess(userConfig, ['WALLETS', 'BTC', 'SECRET']);

    const config = {
        ...Config(14400),
        providerUrl: 'https://spacejelly.network/btc/api/v1/btc/',
        apiProviderUrl: 'https://spacejelly.network/btc/api/v1/btc/',
        explorer: 'https://blockstream.info/tx/',
        REFUND_PERIOD: 10,
        REFUND_BLOCKS: 500,
        VALID_EXPIRATION: 72000,
        NETWORK: Networks.bitcoin,
    };

    if (address && secret) {
        return {
            ...config,
            receiverAddress: address,
            REFUND: address,
            SEED: secret,
        };
    } else {
        throw new Error('Bitcoin ADDRESS and SECRET are missing.');
    }
};
