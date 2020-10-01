import { Config as ERC20Config } from '@jelly-swap/erc20';

import getSupportedNetworks from '../config/supportedNetworks';

import BitcoinConfig from './bitcoin/config';
import EthereumConfig from './ethereum/config';
import HarmonyConfig from './harmony/config';
import AeternityConfig from './aeternity/config';
import { SECONDARY_NETWORKS } from './erc20/config';

export default () => {
    const supportedNetworks = getSupportedNetworks();

    return {
        BTC: supportedNetworks['BTC'] && Config.BTC(),
        ETH: supportedNetworks['ETH'] && Config.ETH(),
        ONE: supportedNetworks['ONE'] && Config.ONE(),
        AE: supportedNetworks['AE'] && Config.AE(),
        ...getErc20Configs(supportedNetworks),
    };
};

const TokenConfig = {
    DAI: {
        network: 'DAI',
        decimals: 18,
        address: '0x2d69ad895797c880abce92437788047ba0eb7ff6',
    },
};

const AddressToToken = {
    '0x2d69ad895797c880abce92437788047ba0eb7ff6': TokenConfig.DAI,
};

const Config = {
    BTC: () => {
        return {
            ...BitcoinConfig(),
            explorer: 'https://blockstream.info/testnet/tx/',
            providerUrl: 'https://localhost:8080',
            apiProviderUrl: 'https://localhost:8080',
        };
    },

    ETH: () => {
        return {
            ...EthereumConfig(),
            explorer: 'https://ropsten.etherscan.io/tx/',
            providerUrl: 'https://ropsten.infura.io/v3/8fe4fc9626494d238879981936dbf144',
            contractAddress: '0xcaa21a48048235ce5b77b6b7b2a1c50417826cfc',
        };
    },

    AE: () => {
        return {
            ...AeternityConfig(),
            explorer: 'https://testnet.explorer.aepps.com/transactions/',
            providerUrl: 'https://sdk-testnet.aepps.com/',
            internalUrl: 'https://sdk-testnet.aepps.com/',
            compilerUrl: 'https://compiler.aepps.com',
            wsUrl: 'wss://testnet.aeternal.io/websocket',
            contractAddress: 'ct_2M9XPMwz1GggFRPatEd2aAPZbig32ZqRJBnhTT2yRVM4k6CQnb',
            receiverAddress: 'ak_2ifr2XxhrMskWdnXZqJE2mVhhwhXYvQD6nRGYLMR5mTSHW4RZz',
            apiUrl: 'https://testnet.aeternal.io/',
        };
    },

    DAI: () => Erc20Config('DAI'),

    ONE: () => {
        return {
            ...HarmonyConfig(),
        };
    },
};

function getErc20Configs(supportedNetworks) {
    return Object.keys(SECONDARY_NETWORKS).reduce((object, token) => {
        if (supportedNetworks[token]) {
            object[token] = Erc20Config(token);
        }
        return object;
    }, {});
}

function Erc20Config(token) {
    return {
        ...ERC20Config(TokenConfig, AddressToToken, 86400),
        ...TokenConfig[token],
        providerUrl: 'https://ropsten.infura.io/v3/8fe4fc9626494d238879981936dbf144',
        contractAddress: '0x66ea49fd943544d59e14d1bd9107217c7503906a',
        explorer: 'https://ropsten.etherscan.io/tx/',
        estimation: 600,
        timestampUnix: true,
        REFUND_PERIOD: 10,
        VALID_EXPIRATION: 72000,
    };
}
