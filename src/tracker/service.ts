import axios from 'axios';
import { logError } from '../logger';

export const fetchSwaps = async (login, expiration = 1) => {
    try {
        const res = await axios.get(
            `https://jelly-tracker.herokuapp.com/api/v1/swaps/receiver/${login}/expiration/${expiration}`
        );

        return res.data;
    } catch (error) {
        logError('FETCH_SWAPS_ERROR: ', error);
        return [];
    }
};

export const fetchWithdraws = async (login, expiration = 1) => {
    try {
        const res = await axios.get(
            `https://jelly-tracker.herokuapp.com/api/v1/withdraws/sender/${login}/expiration/${expiration}`
        );

        return res.data;
    } catch (error) {
        logError('FETCH_WITHDRAWS_ERROR: ', error);
        return [];
    }
};
