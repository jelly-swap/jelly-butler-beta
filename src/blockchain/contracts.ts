import getConfig from './config';
import { SECONDARY_NETWORKS } from './erc20/config';

import BitcoinContract from './bitcoin';
import EthereumContract from './ethereum';
import AeternityContract from './aeternity';
import Erc20Contract from './erc20';
import HarmonyContract from './harmony';
import MaticContract from './matic';
import AvalancheContract from './avalanche';
import BinanceContract from './binance';
import XinfinContract from './xinfin';

let Contracts: any;
let NetworkContracts: any;

const getErc20Contracts = (config) => {
    return Object.keys(SECONDARY_NETWORKS).reduce((object, token) => {
        if (config[token]) {
            object[token] = new Erc20Contract(config[token]);
        }
        return object;
    }, {});
};

const getContracts = () => {
    if (!Contracts) {
        const Config = getConfig();

        const AllContracts = {
            ...getErc20Contracts(Config),
            ETH: Config.ETH && new EthereumContract(Config.ETH),
            BTC: Config.BTC && new BitcoinContract(Config.BTC),
            AE: Config.AE && new AeternityContract(Config.AE),
            ONE: Config.ONE && new HarmonyContract(Config.ONE),
            MATIC: Config.MATIC && new MaticContract(Config.MATIC),
            AVAX: Config.AVAX && new AvalancheContract(Config.AVAX),
            BNB: Config.BNB && new BinanceContract(Config.BNB),
            XDC: Config.XDC && new XinfinContract(Config.XDC),
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

export default getContracts;
