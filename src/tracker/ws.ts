import WebSocket from 'ws';
import Emitter from '../emitter';
import { logDebug } from '../logger';

let ws = null;

export const subscribe = () => {
    if (!ws) {
        ws = new WebSocket('wss://jelly-tracker.herokuapp.com/subscribe');

        ws.onopen = () => {
            console.log('WS OPENED');
        };

        ws.onmessage = (event) => {
            logDebug(`WS_EVENT: `, event.data);
            new Emitter().emit('WS_EVENT', event.data);
        };

        ws.onclose = () => {
            console.log('WS CLOSED');

            ws = null;
            setTimeout(() => {
                subscribe();
            }, 5000);
        };
    }
};
