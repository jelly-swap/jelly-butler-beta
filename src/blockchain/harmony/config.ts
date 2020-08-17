import { Config } from '@jelly-swap/harmony';
import UserConfig from '../../config';
import { safeAccess } from '../../utils';

export default () => {
    const userConfig = new UserConfig().getUserConfig();

    const address = safeAccess(userConfig, ['WALLETS', 'ONE', 'ADDRESS']);
    const secret = safeAccess(userConfig, ['WALLETS', 'ONE', 'SECRET']);

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
        throw new Error('ONE ADDRESS and SECRET are missing.');
    }
};
