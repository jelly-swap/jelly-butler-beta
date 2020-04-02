import AppConfig from '../../config';
import Config, { SECONDARY_NETWORKS } from './config';

import BitcoinContract from './bitcoin';
import EthereumContract from './ethereum';
import AeternityContract from './aeternity';
import Erc20Contract from './erc20';
import TronContract from './tron';

const AllContracts = {
    BTC: AppConfig.NETWORKS?.BTC ? new BitcoinContract(Config.BTC) : null,
    ETH: AppConfig.NETWORKS?.ETH ? new EthereumContract(Config.ETH) : null,
    AE: AppConfig.NETWORKS?.AE ? new AeternityContract(Config.AE) : null,
    DAI: AppConfig.NETWORKS?.DAI ? new Erc20Contract(Config.DAI) : null,
    WBTC: AppConfig.NETWORKS?.WBTC ? new Erc20Contract(Config.WBTC) : null,
    TRX: AppConfig.NETWORKS?.TRX ? new TronContract(Config.TRX) : null,
};

const Contracts = Object.entries(AllContracts).reduce((a, [k, v]) => (v === null ? a : { ...a, [k]: v }), {});

export const startEventListener = async () => {
    for (const network of Object.keys(Contracts)) {
        if (!SECONDARY_NETWORKS[network]) {
            await Contracts[network].subscribe();
        }
    }
};

export default Contracts;
