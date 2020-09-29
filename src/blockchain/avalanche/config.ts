import { Config } from '@jelly-swap/avalanche';
import UserConfig from '../../config';
import { safeAccess } from '../../utils';

export default () => {
    const userConfig = new UserConfig().getUserConfig();

    const address = safeAccess(userConfig, ['WALLETS', 'AVAX', 'ADDRESS']);
    const secret = safeAccess(userConfig, ['WALLETS', 'AVAX', 'SECRET']);

    const config = {
        ...Config(7200),
        explorer: 'https://cchain.explorer.avax.network/tx/',
        providerUrl: 'https://ava.spacejelly.network/api/ext/bc/C/rpc',
        contractAddress: '0x640440c1A691dC824C89f92A856848A9013D3784',
        chainId: 43114,
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
