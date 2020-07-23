import { fetchSwaps, fetchWithdraws } from './service';
import { subscribe } from './ws';
import { EventSwap, ActiveExpiredSwaps } from './types';

import Emitter from '../emitter';
import { cmpIgnoreCase } from '../utils';

export default async (wallets) => {
    const MINUTES_10 = 10 * 1000 * 60;

    const lpAddresses = getLpAddresses(wallets);

    await processPastEvents(lpAddresses, wallets);

    // Get past swaps
    setInterval(() => {
        processPastEvents(lpAddresses, wallets);
    }, MINUTES_10);

    // Process WS Message
    handleMessage(wallets);

    // Subscribe to WS
    subscribe();
};

const SWAP_STATUSES = {
    ACTIVE_STATUS: 1,
    WITHDRAWN_STATUS: 3,
    EXPIRED_STATUS: 4,
};

const processPastEvents = async (lpAddresses, wallets) => {
    const fetchedWithdraws = await fetchWithdraws(lpAddresses);
    const withdraws = getWithdraws(fetchedWithdraws, wallets);

    const fetchedSwaps = await fetchSwaps(lpAddresses);
    const swaps = getActiveAndExpiredSwaps(fetchedSwaps, wallets);

    new Emitter().emit('PROCESS_PAST_SWAPS', { withdraws, ...swaps });
};

const handleMessage = (wallets) => {
    new Emitter().on('WS_EVENT', (message) => {
        const { topic, data } = JSON.parse(message);
        const { sender, receiver, network, outputNetwork } = data;

        switch (topic) {
            case 'Swap': {
                const lpAddress = wallets[outputNetwork]?.ADDRESS;

                if (lpAddress && cmpIgnoreCase(lpAddress, receiver)) {
                    new Emitter().emit('NEW_CONTRACT', data);
                    break;
                }
            }

            case 'Withdraw': {
                const lpAddress = wallets[network]?.ADDRESS;

                if (lpAddress && cmpIgnoreCase(lpAddress, sender)) {
                    new Emitter().emit('WITHDRAW', data);
                    break;
                }
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
    return swaps.reduce(
        (p: ActiveExpiredSwaps, c: EventSwap) => {
            const { sender, receiver, network, status } = c;
            const lpAddress = wallets[network]?.ADDRESS;

            switch (status) {
                case SWAP_STATUSES.ACTIVE_STATUS: {
                    if (cmpIgnoreCase(receiver, lpAddress)) {
                        p.activeSwaps.push(c);
                    }
                    break;
                }

                case SWAP_STATUSES.EXPIRED_STATUS: {
                    if (cmpIgnoreCase(sender, lpAddress)) {
                        p.expiredSwaps.push(c);
                    }
                }
            }
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
