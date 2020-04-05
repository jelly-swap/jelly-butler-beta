import BitcoinConfig from './bitcoin/config';
import EthereumConfig from './ethereum/config';
import AeternityConfig from './aeternity/config';
import Erc20Config from './erc20/config';
import TronConfig from './tron/config';

export default {
    BTC: BitcoinConfig,
    ETH: EthereumConfig,
    AE: AeternityConfig,
    DAI: Erc20Config('DAI'),
    USDC: Erc20Config('USDC'),
    WBTC: Erc20Config('WBTC'),
    TRX: TronConfig,
};
