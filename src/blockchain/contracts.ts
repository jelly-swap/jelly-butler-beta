import getConfig, { SECONDARY_NETWORKS } from './config';

import BitcoinContract from './bitcoin';
import EthereumContract from './ethereum';
import AeternityContract from './aeternity';
import Erc20Contract from './erc20';

let Contracts: any;

export default () => {
    if (!Contracts) {
        const Config = getConfig();

        const AllContracts = {
            ETH: Config.ETH && new EthereumContract(Config.ETH),
            BTC: Config.BTC && new BitcoinContract(Config.BTC),
            AE: Config.AE && new AeternityContract(Config.AE),
            DAI: Config.DAI && new Erc20Contract(Config.DAI),
            USDC: Config.USDC && new Erc20Contract(Config.USDC),
            WBTC: Config.WBTC && new Erc20Contract(Config.WBTC),
        };

        Contracts = Object.entries(AllContracts).reduce(
            (a, [k, v]) => (v === undefined ? a : { ...a, [k]: v }),
            {}
        ) as any;
    }

    return Contracts;
};

export const startEventListener = async () => {
    for (const network of Object.keys(Contracts)) {
        if (!SECONDARY_NETWORKS[network]) {
            await Contracts[network].subscribe();
        }
    }
};
