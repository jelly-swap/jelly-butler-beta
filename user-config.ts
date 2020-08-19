import TestnetConfig from './user-config-testnet';
import MainnetConfig from './user-config-mainnet';

export default process.env.NETWORK === 'testnet' ? TestnetConfig : MainnetConfig;
