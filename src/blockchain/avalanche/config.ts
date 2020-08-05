import { Config } from '@jelly-swap/avalanche';
import UserConfig from '../../config';
import { safeAccess } from '../../utils';

export default () => {
    const userConfig = new UserConfig().getUserConfig();

    const address = safeAccess(userConfig, ['WALLETS', 'AVAX', 'ADDRESS']);
    const secret = safeAccess(userConfig, ['WALLETS', 'AVAX', 'SECRET']);

    const config = {
        ...Config(7200),
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
        throw new Error('AVAX ADDRESS and SECRET are missing.');
    }
};
