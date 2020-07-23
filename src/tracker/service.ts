import axios from 'axios';

export const fetchSwaps = async (login) => {
    try {
        if (login) {
            const res = await axios.get(
                `https://jelly-tracker.herokuapp.com/api/v1/swaps/address/${login}/expiration/1`
            );

            return res.data;
        } else {
            return [];
        }
    } catch (error) {
        console.log('FETCH_SWAPS_ERROR: ', error);
        return [];
    }
};

export const fetchWithdraws = async (login) => {
    try {
        // TODO: Change endpoint to jelly-tracker
        const res = await axios.get(`http://localhost:8080/withdraws`);

        return res.data;
    } catch (error) {
        console.log('FETCH_WITHDRAWS_ERROR: ', error);
        return [];
    }
};
