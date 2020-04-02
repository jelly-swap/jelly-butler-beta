import AppConfig from '../../config';

import IExchange from './IExchange';
import Exchanges from './exchanges';
import { logError } from '../logger';
import { safeAccess } from '../utils';
import { toFixed, divDecimals } from '../utils/math';

import Config from '../blockchain/config';

export default class Exchange implements IExchange {
    private static Instance: Exchange;

    private exchange: IExchange;

    constructor() {
        if (Exchange.Instance) {
            return Exchange.Instance;
        }

        if (Exchanges[AppConfig.EXCHANGE]) {
            this.exchange = new Exchanges[AppConfig.EXCHANGE]();
        } else {
            this.exchange = new Exchanges.mock();
        }

        Exchange.Instance = this;
    }

    async placeOrder(swap: any): Promise<boolean> {
        const base = swap.network;
        const quote = swap.outputNetwork;
        const buy = this.fixPrecision(quote, swap.outputAmount);
        const sell = this.fixPrecision(base, swap.inputAmount);

        try {
            const result = await this.exchange.placeOrder({ quote, base, buy, sell });
            return result;
        } catch (err) {
            logError('PLACE_ORDER_ERROR', err);
            return false;
        }
    }

    fixPrecision(quote, quantity) {
        const precision = safeAccess(AppConfig, [AppConfig.EXCHANGE.toUpperCase(), 'PRECISION', quote]);

        if (precision) {
            return toFixed(divDecimals(quantity, Config[quote].decimals), precision);
        }
    }
}
