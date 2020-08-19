import axios from 'axios';
import { logDebug, logError } from '../logger';

export const fetchSwaps = async (url, login, expiration = 1) => {
    try {
        if (login) {
            const res = await axios.get(`https://${url}/api/v1/swaps/receiver/${login}/expiration/${expiration}`);

            return res.data;
        } else {
            logError('Cannot fetch swaps. This is a bug.');
        }

        return [];
    } catch (error) {
        logDebug('FETCH_SWAPS_ERROR: ', error);
        return [];
    }
};

export const fetchExpiredSwaps = async (url, login, status = 4) => {
    try {
        if (login) {
            const res = await axios.get(`https://${url}/api/v1/swaps/sender/${login}/status/${status}`);

            return res.data;
        } else {
            logError('Cannot fetch expired swaps. This is a bug.');
        }

        return [];
    } catch (error) {
        logDebug('FETCH_EXPIRED_SWAPS_ERROR: ', error);
        return [];
    }
};

export const fetchWithdraws = async (url, login, expiration = 1) => {
    try {
        if (login) {
            const res = await axios.get(`https://${url}/api/v1/withdraws/sender/${login}/expiration/${expiration}`);

            return res.data;
        } else {
            logError('Cannot fetch swaps. This is a bug.');
        }

        return [];
    } catch (error) {
        logDebug('FETCH_WITHDRAWS_ERROR: ', error);
        return [];
    }
};
