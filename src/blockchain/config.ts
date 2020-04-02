import TestnetConfig from './config-testnet';
import MainnetConfig from './config-mainnet';

const Config = process.env.NETWORK === 'testnet' ? TestnetConfig : MainnetConfig;

export default Config;

export const SECONDARY_NETWORKS = {
    WBTC: 'WBTC',
};
