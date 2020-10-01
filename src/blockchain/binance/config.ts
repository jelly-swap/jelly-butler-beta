import { Config } from '@jelly-swap/avalanche';
import UserConfig from '../../config';
import { safeAccess } from '../../utils';

export default () => {
    const userConfig = new UserConfig().getUserConfig();

    const address = safeAccess(userConfig, ['WALLETS', 'BNB', 'ADDRESS']);
    const secret = safeAccess(userConfig, ['WALLETS', 'BNB', 'SECRET']);

    const config = {
        ...Config(7200),
        explorer: 'https://bscscan.com//tx/',
        providerUrl: 'https://bsc-dataseed.binance.org/',
        contractAddress: '0xe77b9f7a4b0f22ab015c30d9f1a016b4759179ae',
        chainId: 56,
        REFUND_PERIOD: 10,
        VALID_EXPIRATION: 72000,
    };

    if (address && secret) {
        return {
            ...config,
            receiverAddress: address,
            PRIVATE_KEY: secret,
        };
    } else {
        throw new Error('BNB ADDRESS and BNB are missing.');
    }
};
