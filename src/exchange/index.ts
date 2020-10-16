import IExchange from './IExchange';
import Exchanges from './exchanges';
import { logError } from '../logger';

import { IUserConfig } from '../types/UserConfig';
import UserConfig from '../config';

export default class Exchange implements IExchange {
    private static Instance: Exchange;

    private exchange: IExchange;

    private userConfig: IUserConfig;

    constructor() {
        if (Exchange.Instance) {
            return Exchange.Instance;
        }

        this.userConfig = new UserConfig().getUserConfig();

        if (Exchanges[this.userConfig?.EXCHANGE?.NAME]) {
            this.exchange = new Exchanges[this.userConfig.EXCHANGE.NAME]();
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
            logError(`Could not place order in ${this.userConfig.EXCHANGE.NAME}.`);
            logError(`PLACE_ORDER_ERROR ${err}`);
            return false;
        }
    }

    async getBalance() {
        return await this.exchange.getBalance();
    }

    fixPrecision(quote, quantity) {
        return this.exchange.fixPrecision(quote, quantity);
    }
}
