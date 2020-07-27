import { Config } from '@jelly-swap/ethereum';
import UserConfig from '../../config';
import { safeAccess } from '../../utils';

export default () => {
    const userConfig = new UserConfig().getUserConfig();

    const address = safeAccess(userConfig, ['WALLETS', 'ETH', 'ADDRESS']);
    const secret = safeAccess(userConfig, ['WALLETS', 'ETH', 'SECRET']);

    const config = {
        ...Config(7200),
        providerUrl:
            userConfig.BLOCKCHAIN_PROVIDER?.INFURA || 'https://mainnet.infura.io/v3/ee13a282868d4e7cb7d9a9543958631d',
        contractAddress: '0x471B080EffB2bc6fb33c8c6FE6ce1AB46F9f522b',
        explorer: 'https://etherscan.io/tx/',
        REFUND_PERIOD: 10,
        VALID_EXPIRATION: 72000,
        gasMultiplier: 1,
    };

    if (address && secret) {
        return {
            ...config,
            receiverAddress: address,
            PRIVATE_KEY: secret,
        };
    } else {
        throw new Error('Ethereum ADDRESS and SECRET are missing.');
    }
};
