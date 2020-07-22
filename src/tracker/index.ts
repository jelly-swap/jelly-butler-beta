import WebSocket = require('ws');
import Emitter from '../emitter';
import axios from 'axios';

let ws = null;

export const subscribe = () => {
    if (!ws?.readyState) {
        ws = new WebSocket('ws://localhost:8080');

        ws.onopen = () => {
            console.log('WS OPENED');
        };

        ws.onmessage = (event) => {
            new Emitter().emit('WS_EVENT', event.data);
        };

        ws.onclose = () => {
            console.log('WS CLOSED');
            ws = new WebSocket('ws://localhost:8080');
        };

        setInterval(() => {
            ws.send('pong');
        }, 45000);
    }
};

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

export const fetchWithdraws = async () => {
    try {
        // TODO: Change endpoint to jelly-tracker

        const res = await axios.get(`http://localhost:8080/withdraws`);

        return res.data;
    } catch (error) {
        console.log('FETCH_WITHDRAWS_ERROR: ', error);
        return [];
    }
};