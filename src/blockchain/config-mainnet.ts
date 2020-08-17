import BitcoinConfig from './bitcoin/config';
import EthereumConfig from './ethereum/config';
import AeternityConfig from './aeternity/config';
import Erc20Config from './erc20/config';
import HarmonyConfig from './harmony/config';

import getSupportedNetworks from '../config/supportedNetworks';
import { SECONDARY_NETWORKS } from './config';

const getErc20Configs = (supportedNetworks) => {
    return Object.keys(SECONDARY_NETWORKS).reduce((object, token) => {
        if (supportedNetworks[token]) {
            object[token] = Erc20Config(token);
        }
        return object;
    }, {});
};

export default () => {
    const supportedNetworks = getSupportedNetworks();

    return {
        BTC: supportedNetworks['BTC'] && BitcoinConfig(),
        ETH: supportedNetworks['ETH'] && EthereumConfig(),
        AE: supportedNetworks['AE'] && AeternityConfig(),
        ONE: supportedNetworks['ONE'] && HarmonyConfig(),
        ...getErc20Configs(supportedNetworks),
    };
};
