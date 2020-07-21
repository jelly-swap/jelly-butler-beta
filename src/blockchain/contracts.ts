import getConfig, { SECONDARY_NETWORKS } from './config';

import BitcoinContract from './bitcoin';
import EthereumContract from './ethereum';
import AeternityContract from './aeternity';
import Erc20Contract from './erc20';

import Emitter from '../emitter';
import { subscribe, fetchSwaps } from '../tracker';
import { cmpIgnoreCase } from '../utils';

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

export const startEventListener = async (wallets) => {
    const MINUTES_10 = 10 * 1000 * 60;

    setTimeout(() => {
        getPastSwaps(wallets);
    }, 0);

    // Get past swaps
    setInterval(() => {
        getPastSwaps(wallets);
    }, MINUTES_10);

    // Subscribe to WS
    subscribe();

    // Process WS Message
    handleMessage(wallets);
};

const getPastSwaps = async (wallets) => {
    const SWAP_STATUSES = {
        ACTIVE_STATUS: 1,
        WITHDRAWN_STATUS: 3,
        EXPIRED_STATUS: 4,
    };

    const { ACTIVE_STATUS, WITHDRAWN_STATUS, EXPIRED_STATUS } = SWAP_STATUSES;

    const addresses = Object.keys(wallets)
        .map((wallet) => wallets[wallet].ADDRESS)
        .filter(Boolean)
        .join(';');

    const swaps = await fetchSwaps(addresses);

    // Old status === ACTIVE_STATS ( 1 ) && receiver === lp address
    const oldSwaps = swaps.filter(
        ({ status, receiver, network }) =>
            status === ACTIVE_STATUS && cmpIgnoreCase(receiver, wallets[network]?.ADDRESS)
    );

    // Old withdraws === ACTIVE_STATS ( 3 ) && sender === lp address
    const oldWithdraws = swaps.filter(
        ({ status, sender, network }) => status === WITHDRAWN_STATUS && cmpIgnoreCase(sender, wallets[network]?.ADDRESS)
    );

    // Old expiredSwaps === ACTIVE_STATS ( 4 ) && sender === lp address
    const expiredSwaps = swaps.filter(
        ({ sender, network, status }) => status === EXPIRED_STATUS && cmpIgnoreCase(sender, wallets[network]?.ADDRESS)
    );

    new Emitter().emit('PROCESS_PAST_SWAPS', { oldSwaps, oldWithdraws, expiredSwaps });
};

const handleMessage = (wallets) => {
    new Emitter().on('WS_EVENT', (message) => {
        const { topic, data } = JSON.parse(message);
        const { sender, receiver, network, outputNetwork } = data;

        switch (topic) {
            case 'Swap': {
                const receiverAddress = wallets[outputNetwork]?.ADDRESS;

                if (receiverAddress && cmpIgnoreCase(receiverAddress, receiver)) {
                    new Emitter().emit('NEW_CONTRACT', data);
                    break;
                }
            }

            case 'Withdraw': {
                const senderAddress = wallets[network]?.ADDRESS;

                if (sender && cmpIgnoreCase(senderAddress, sender)) {
                    new Emitter().emit('WITHDRAW', data);
                    break;
                }
            }

            default:
                break;
        }
    });
};

export default getContracts;
