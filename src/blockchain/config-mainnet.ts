import BitcoinConfig from './bitcoin/config';
import EthereumConfig from './ethereum/config';
import AeternityConfig from './aeternity/config';
import Erc20Config from './erc20/config';

import getSupportedNetworks from '../config/supportedNetworks';

export default () => {
    const supportedNetworks = getSupportedNetworks();

    return {
        BTC: supportedNetworks['BTC'] && BitcoinConfig(),
        ETH: supportedNetworks['ETH'] && EthereumConfig(),
        AE: supportedNetworks['AE'] && AeternityConfig(),
        DAI: supportedNetworks['DAI'] && Erc20Config('DAI'),
        USDC: supportedNetworks['USDC'] && Erc20Config('USDC'),
        WBTC: supportedNetworks['WBTC'] && Erc20Config('WBTC'),
    };
};
