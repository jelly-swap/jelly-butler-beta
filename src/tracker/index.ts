import moment from 'moment';

import { fetchSwaps, fetchWithdraws } from './service';
import { subscribe } from './ws';
import { EventSwap, ActiveExpiredSwaps } from './types';

import Emitter from '../emitter';
import { cmpIgnoreCase } from '../utils';
import getConfig from '../blockchain/config';

export default async (wallets) => {
    const MINUTES_15 = 15 * 1000 * 60;

    const lpAddresses = getLpAddresses(wallets);

    await processPastEvents(lpAddresses, wallets);

    setInterval(() => {
        processPastEvents(lpAddresses, wallets);
    }, MINUTES_15);

    handleMessage(wallets);

    subscribe();
};

const SWAP_STATUSES = {
    ACTIVE_STATUS: 1,
    WITHDRAWN_STATUS: 3,
    EXPIRED_STATUS: 4,
};

const processPastEvents = async (lpAddresses, wallets) => {
    const past5Days = moment().subtract(5, 'days').unix();

    const fetchedWithdraws = await fetchWithdraws(lpAddresses, past5Days);
    const withdraws = getWithdraws(fetchedWithdraws, wallets);

    const fetchedSwaps = await fetchSwaps(lpAddresses, past5Days);
    const swaps = getActiveAndExpiredSwaps(fetchedSwaps, wallets);

    new Emitter().emit('PROCESS_PAST_SWAPS', { withdraws, ...swaps });
};

const handleMessage = (wallets) => {
    new Emitter().on('WS_EVENT', (message) => {
        const { topic, data } = JSON.parse(message);

        switch (topic) {
            case 'Swap': {
                const { receiver, outputNetwork } = data;
                const lpAddress = wallets[outputNetwork]?.ADDRESS;

                if (lpAddress && cmpIgnoreCase(lpAddress, receiver)) {
                    new Emitter().emit('NEW_CONTRACT', data);
                }
                break;
            }

            case 'Withdraw': {
                const { sender, network } = data;
                const lpAddress = wallets[network]?.ADDRESS;

                if (lpAddress && cmpIgnoreCase(lpAddress, sender)) {
                    new Emitter().emit('WITHDRAW', data);
                }
                break;
            }

            default:
                break;
        }
    });
};

const getWithdraws = (withdraws, wallets) => {
    return withdraws.filter(({ sender, network }) => cmpIgnoreCase(sender, wallets[network]?.ADDRESS));
};

const getActiveAndExpiredSwaps = (swaps, wallets) => {
    const last12Hours = moment().subtract(12, 'hours').unix();
    const config = getConfig();

    return swaps.reduce(
        (p: ActiveExpiredSwaps, c: EventSwap) => {
            const { sender, receiver, network, status } = c;
            const lpAddress = wallets[network]?.ADDRESS;

            if (lpAddress && config[c.network]) {
                switch (status) {
                    case SWAP_STATUSES.ACTIVE_STATUS: {
                        if (cmpIgnoreCase(receiver, lpAddress)) {
                            const expiration = config[c.network].unix ? c.expiration : c.expiration / 1000;
                            if (expiration > last12Hours) {
                                p.activeSwaps.push(c);
                            }
                        }
                        break;
                    }

                    case SWAP_STATUSES.EXPIRED_STATUS: {
                        if (cmpIgnoreCase(sender, lpAddress)) {
                            p.expiredSwaps.push(c);
                        }
                    }
                }
            }

            return p;
        },
        { activeSwaps: [], expiredSwaps: [] } as ActiveExpiredSwaps
    );
};

const getLpAddresses = (wallets) => {
    return Object.keys(wallets)
        .map((wallet) => wallets[wallet].ADDRESS)
        .filter(Boolean)
        .join(';');
};
