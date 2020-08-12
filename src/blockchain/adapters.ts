import { Adapter as BitcoinAdapter } from '@jelly-swap/bitcoin';
import { Adapter as EthereumAdapter } from '@jelly-swap/ethereum';
import { Adapter as AvalancheAdapter } from '@jelly-swap/avalanche';
import { Adapter as MaticAdapter } from '@jelly-swap/matic';
import { Adapter as HarmonyAdapter } from '@jelly-swap/harmony';
import { Adapter as AeternityAdapter } from '@jelly-swap/aeternity';
import { Adapter as Erc20Adapter } from '@jelly-swap/erc20';

import getConfig, { SECONDARY_NETWORKS } from './config';

let Adapters: any;

const getErc20Adapters = (config) => {
    return Object.keys(SECONDARY_NETWORKS).reduce((object, token) => {
        if (config[token]) {
            object[token] = new Erc20Adapter(config[token]);
        }
        return object;
    }, {});
};

export default () => {
    if (!Adapters) {
        const Config = getConfig();

        const AllAdapters = {
            ...getErc20Adapters(Config),
            ETH: Config.ETH && new EthereumAdapter(Config.ETH as any),
            BTC: Config.BTC && new BitcoinAdapter(Config.BTC as any),
            AE: Config.AE && new AeternityAdapter(Config.AE as any),
            AVAX: Config.AVAX && new AvalancheAdapter(Config.AVAX),
            MATIC: Config.MATIC && new MaticAdapter(Config.MATIC),
            ONE: Config.ONE && new HarmonyAdapter(Config.ONE),
        };

        Adapters = Object.entries(AllAdapters).reduce((a, [k, v]) => (v === undefined ? a : { ...a, [k]: v }), {});
    }

    return Adapters;
};
