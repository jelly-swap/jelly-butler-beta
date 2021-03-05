import { Config } from '@jelly-swap/avalanche';
import UserConfig from '../../config';
import { safeAccess } from '../../utils';

export default () => {
    const userConfig = new UserConfig().getUserConfig();

    const address = safeAccess(userConfig, ['WALLETS', 'XDC', 'ADDRESS']);
    const secret = safeAccess(userConfig, ['WALLETS', 'XDC', 'SECRET']);

    const config = {
        ...Config(7200),
        explorer: 'https://explorer.xinfin.network/tx/',
        providerUrl: 'https://appsrpc.xinfin.network/',
        contractAddress: '0xdc81ec2ea4e84e8f53824922101b3d285e4c036b',
        chainId: 50,
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
        throw new Error('XDC ADDRESS and XDC Private key are missing.');
    }
};
