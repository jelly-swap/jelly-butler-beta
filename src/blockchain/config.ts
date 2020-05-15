import TestnetConfig from './config-testnet';
import MainnetConfig from './config-mainnet';

let Config;

export const SECONDARY_NETWORKS = {
    WBTC: 'WBTC',
    USDC: 'USDC',
    DAI: 'DAI',
};

export default () => {
    if (!Config) {
        Config = process.env.NETWORK === 'testnet' ? TestnetConfig : MainnetConfig();
    }

    return Config;
};
