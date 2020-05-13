import { Adapter as BitcoinAdapter } from '@jelly-swap/bitcoin';
import { Adapter as EthereumAdapter, Adapter } from '@jelly-swap/ethereum';
import { Adapter as AeternityAdapter } from '@jelly-swap/aeternity';
import { Adapter as Erc20Adapter } from '@jelly-swap/erc20';

import getConfig from './config';

let Adapters: any;

export default () => {
    if (!Adapters) {
        const Config = getConfig();

        const AllAdapters = {
            ETH: Config.ETH && new EthereumAdapter(Config.ETH as any),
            BTC: Config.BTC && new BitcoinAdapter(Config.BTC as any),
            AE: Config.AE && new AeternityAdapter(Config.AE as any),
            DAI: Config.DAI && new Erc20Adapter('DAI', Config.DAI),
            USDC: Config.USDC && new Erc20Adapter('USDC', Config.USDC),
            WBTC: Config.WBTC && new Erc20Adapter('WBTC', Config.WBTC),
        };

        Adapters = Object.entries(AllAdapters).reduce((a, [k, v]) => (v === undefined ? a : { ...a, [k]: v }), {});
    }

    return Adapters;
};
