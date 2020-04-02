import { Config } from '@jelly-swap/erc20';

import AppConfig from '../../../config';

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
};

const AddressToToken = {
    '0x2260fac5e5542a773aa44fbcfedf7c193bc2c599': TokenConfig.WBTC,
    '0x6b175474e89094c44da98b954eedeac495271d0f': TokenConfig.DAI,
};

export default token => {
    const tokenConfig = Config(token, TokenConfig, AddressToToken, 3600);
    return {
        ...tokenConfig,
        providerUrl: 'https://mainnet.infura.io/v3/02cf6338c88b42f595f8fd946134fa4b',
        contractAddress: '0x133DbFdf74f565838A2f9413Fb53761a19f06ADF',
        explorer: 'https://etherscan.io/tx/',
        REFUND_PERIOD: 10,
        VALID_EXPIRATION: 72000,

        receiverAddress: AppConfig.BLOCKCHAIN[token].ADDRESS,
        PRIVATE_KEY: AppConfig.BLOCKCHAIN[token].SECRET,
    };
};
