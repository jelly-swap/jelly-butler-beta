import getConfig, { SECONDARY_NETWORKS } from './config';

import BitcoinContract from './bitcoin';
import EthereumContract from './ethereum';
import AeternityContract from './aeternity';
import Erc20Contract from './erc20';

let Contracts: any;
let NetworkContracts: any;

const getContracts = () => {
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

export const getNetworkContracts = () => {
    if (!NetworkContracts) {
        NetworkContracts = Object.entries(Contracts).reduce((a, [k, v]) => {
            if (SECONDARY_NETWORKS[k]) {
                a['ERC20'] = v;
            } else {
                a[k] = v;
            }
            return a;
        }, {}) as any;
    }

    return NetworkContracts;
};

export const startEventListener = async () => {
    getContracts();
    getNetworkContracts();
    for (const network in NetworkContracts) {
        await NetworkContracts[network].subscribe();
    }
};

export default getContracts;
