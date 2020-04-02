import AppConfig from '../../config';

import { Adapter as BitcoinAdapter } from '@jelly-swap/bitcoin';
import { Adapter as EthereumAdapter } from '@jelly-swap/ethereum';
import { Adapter as AeternityAdapter } from '@jelly-swap/aeternity';
import { Adapter as Erc20Adapter } from '@jelly-swap/erc20';
import { Adapter as TronAdapter } from '@jelly-swap/tron';
import Config from './config';

const AllAdapters = {
    BTC: AppConfig.NETWORKS.BTC ? new BitcoinAdapter(Config.BTC) : null,
    ETH: AppConfig.NETWORKS.ETH ? new EthereumAdapter(Config.ETH) : null,
    AE: AppConfig.NETWORKS.AE ? new AeternityAdapter(Config.AE) : null,
    DAI: AppConfig.NETWORKS.DAI ? new Erc20Adapter('DAI', Config.DAI) : null,
    WBTC: AppConfig.NETWORKS.WBTC ? new Erc20Adapter('WBTC', Config.WBTC) : null,
    TRX: AppConfig.NETWORKS.TRX ? new TronAdapter(Config.TRX) : null,
};

const Adapters = Object.entries(AllAdapters).reduce((a, [k, v]) => (v === null ? a : { ...a, [k]: v }), {});

export default Adapters;
