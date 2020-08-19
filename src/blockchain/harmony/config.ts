import { Config } from '@jelly-swap/harmony';
import UserConfig from '../../config';
import { safeAccess } from '../../utils';

export default () => {
    const userConfig = new UserConfig().getUserConfig();

    const address = safeAccess(userConfig, ['WALLETS', 'ONE', 'ADDRESS']);
    const secret = safeAccess(userConfig, ['WALLETS', 'ONE', 'SECRET']);

    const config = {
        ...Config(7200),
        providerUrl: 'https://api.s0.t.hmny.io',
        contractAddress: '0x381a5b682D3e143DCADc0C42912CB97BED501919',
        explorer: 'https://explorer.harmony.one/#/tx/',
        chainId: 1, // mainnet
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
