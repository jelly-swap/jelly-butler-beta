import BitcoinConfig from './bitcoin/config';
import EthereumConfig from './ethereum/config';
import AeternityConfig from './aeternity/config';
import Erc20Config, { SECONDARY_NETWORKS } from './erc20/config';
import HarmonyConfig from './harmony/config';
import MaticConfig from './matic/config';
import AvalancheConfig from './avalanche/config';
import BinanceConfig from './binance/config';
import XinfinConfig from './xinfin/config';

import getSupportedNetworks from '../config/supportedNetworks';

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
        MATIC: supportedNetworks['MATIC'] && MaticConfig(),
        AVAX: supportedNetworks['AVAX'] && AvalancheConfig(),
        BNB: supportedNetworks['BNB'] && BinanceConfig(),
        XDC: supportedNetworks['XDC'] && XinfinConfig(),
        ...getErc20Configs(supportedNetworks),
    };
};
