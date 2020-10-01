import TestnetConfig from './config-testnet';
import MainnetConfig from './config-mainnet';

let Config;

export default () => {
    if (!Config) {
        Config = process.env.NETWORK === 'testnet' ? TestnetConfig() : MainnetConfig();
    }

    return Config;
};
