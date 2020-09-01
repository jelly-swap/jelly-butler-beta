import { Config } from '@jelly-swap/matic';
import UserConfig from '../../config';
import { safeAccess } from '../../utils';

export default () => {
    const userConfig = new UserConfig().getUserConfig();

    const address = safeAccess(userConfig, ['WALLETS', 'MATIC', 'ADDRESS']);
    const secret = safeAccess(userConfig, ['WALLETS', 'MATIC', 'SECRET']);

    const config = {
        ...Config(7200),
        providerUrl: 'https://rpc-mainnet.matic.network',
        contractAddress: '0x1Ef8a808B3bE1Fc725Db5f6BAA9DC187E8b033eE',
        explorer: 'https://explorer.matic.network/tx/',
        chainId: 137, // mainnet
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
        throw new Error('MATIC ADDRESS and SECRET are missing.');
    }
};
