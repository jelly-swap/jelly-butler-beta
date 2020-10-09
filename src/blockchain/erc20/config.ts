import { Config } from '@jelly-swap/erc20';

import UserConfig from '../../config';
import { safeAccess } from '../../utils';

const TokenConfig = {
    DAI: {
        network: 'DAI',
        decimals: 18,
        address: '0x6b175474e89094c44da98b954eedeac495271d0f',
    },
    WBTC: {
        network: 'WBTC',
        decimals: 8,
        address: '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599',
    },
    TBTC: {
        network: 'TBTC',
        decimals: 18,
        address: '0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa',
    },
    USDC: {
        network: 'USDC',
        decimals: 6,
        address: '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48',
    },
};

export const SECONDARY_NETWORKS = Object.keys(TokenConfig).reduce((result, token) => {
    result[token] = true;
    return result;
}, {});

const AddressToToken = {
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': TokenConfig.WBTC,
    '0x6b175474e89094c44da98b954eedeac495271d0f': TokenConfig.DAI,
    '0xa0b86991c6218b36c1d19d4a2e9eb0ce3606eb48': TokenConfig.USDC,
    '0x8dAEBADE922dF735c38C80C7eBD708Af50815fAa': TokenConfig.TBTC,
};

export default (token) => {
    const userConfig = new UserConfig().getUserConfig();

    const address = safeAccess(userConfig, ['WALLETS', token, 'ADDRESS']);
    const secret = safeAccess(userConfig, ['WALLETS', token, 'SECRET']);

    const config = {
        ...Config(TokenConfig, AddressToToken, 7200),
        ...TokenConfig[token],
        providerUrl:
            userConfig.BLOCKCHAIN_PROVIDER?.INFURA || 'https://mainnet.infura.io/v3/02cf6338c88b42f595f8fd946134fa4b',
        contractAddress: '0x133DbFdf74f565838A2f9413Fb53761a19f06ADF',
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
        throw new Error(`${token} ADDRESS and SECRET are missing.`);
    }
};
