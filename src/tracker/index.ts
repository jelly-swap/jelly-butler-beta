import moment from 'moment';

import { fetchSwaps, fetchWithdraws, fetchExpiredSwaps } from './service';
import { subscribe } from './ws';
import { EventSwap } from './types';

import Emitter from '../emitter';
import { cmpIgnoreCase } from '../utils';
import getConfig from '../blockchain/config';

export default async (config) => {
    const { WALLETS, TRACKER_URL } = config;

    const MINUTES_15 = 15 * 1000 * 60;

    const lpAddresses = getLpAddresses(WALLETS);

    await processPastEvents(lpAddresses, WALLETS, TRACKER_URL);

    setInterval(() => {
        processPastEvents(lpAddresses, WALLETS, TRACKER_URL);
    }, MINUTES_15);

    handleMessage(WALLETS);

    subscribe(TRACKER_URL);
};

const SWAP_STATUSES = {
    ACTIVE_STATUS: 1,
    WITHDRAWN_STATUS: 3,
    EXPIRED_STATUS: 4,
};

const processPastEvents = async (lpAddresses, wallets, url) => {
    const past5Days = moment().subtract(5, 'days').unix();

    const fetchedWithdraws = await fetchWithdraws(url, lpAddresses, past5Days);
    const withdraws = getWithdraws(fetchedWithdraws, wallets);

    const fetchedSwaps = await fetchSwaps(url, lpAddresses, past5Days);
    const activeSwaps = getActiveSwaps(fetchedSwaps, wallets);

    const fetchedExpiredSwaps = await fetchExpiredSwaps(url, lpAddresses);
    const expiredSwaps = getExpiredSwaps(fetchedExpiredSwaps, wallets);

    new Emitter().emit('PROCESS_PAST_SWAPS', { withdraws, activeSwaps, expiredSwaps });
};

const handleMessage = (wallets) => {
    new Emitter().on('WS_EVENT', (message) => {
        const { topic, data } = JSON.parse(message);

        switch (topic) {
            case 'Swap': {
                const { receiver, network } = data;
                const lpAddress = wallets[network]?.ADDRESS;

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

const getExpiredSwaps = (swaps, wallets) => {
    return swaps.filter(({ sender, network }) => cmpIgnoreCase(sender, wallets[network]?.ADDRESS));
};

const getActiveSwaps = (swaps, wallets) => {
    const last12Hours = moment().subtract(12, 'hours').unix();
    const config = getConfig();

    return swaps.reduce((p: EventSwap[], c: EventSwap) => {
        const { receiver, network, status, expiration } = c;
        const lpAddress = wallets[network]?.ADDRESS;

        if (lpAddress && config[network]) {
            if (status === SWAP_STATUSES.ACTIVE_STATUS) {
                if (cmpIgnoreCase(receiver, lpAddress)) {
                    const fixedExpiration = config[network].unix ? expiration : expiration / 1000;
                    if (fixedExpiration > last12Hours) {
                        p.push(c);
                    }
                }
            }
        }

        return p;
    }, [] as EventSwap[]);
};

const getLpAddresses = (wallets) => {
    return Object.keys(wallets)
        .map((wallet) => wallets[wallet].ADDRESS)
        .filter(Boolean)
        .join(';');
};
