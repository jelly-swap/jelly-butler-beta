import Config from '../../config';

import * as Binance from 'node-binance-api';

import IExchange from './IExchange';
import { div, add, toFixed, divDecimals } from '../utils/math';
import { logInfo, logError } from '../logger';
import AppConfig from '../../config';
import { safeAccess } from '../utils';
import { IUserConfig } from '../types/UserConfig';
import UserConfig from '../config';

export default class BinanceExchange implements IExchange {
    private static Instance: BinanceExchange;

    private binance: any;

    private userConfig: IUserConfig;

    constructor() {
        if (BinanceExchange.Instance) {
            return BinanceExchange.Instance;
        }

        this.userConfig = new UserConfig().getUserConfig();

        this.binance = Binance().options({
            APIKEY: this.userConfig.EXCHANGE.API_KEY,
            APISECRET: this.userConfig.EXCHANGE.SECRET_KEY,
            useServerTime: true,
        });

        BinanceExchange.Instance = this;
    }

    async placeOrder(order) {
        try {
            const exchangeOrder = this.formatOrder(order);

            if (!exchangeOrder) {
                logInfo(`BINANCE_INVALID_PAIR ${order.quote + order.base}`);
                return;
            }

            const { type, pair, quantity } = exchangeOrder;

            await this.binance[type](pair, quantity, (err, response) => {
                if (err) {
                    logError('BINANCE_ORDER_PLACE_ERROR', err);
                } else {
                    logInfo(`BINANCE_ORDER_PLACED ${pair} ${quantity} ${response.orderId}`);
                }
            });

            return true;
        } catch (err) {
            logError('BINANCE_PLACE_ORDER_ERROR', err);
            return false;
        }
    }

    async getBalance() {
        try {
            const filteredBalances = {};

            return new Promise((resolve, reject) => {
                this.binance.balance((error, balances) => {
                    if (error) {
                        reject(error);
                    } else {
                        for (const network in AppConfig.NETWORKS) {
                            if (balances[network]) {
                                const available = safeAccess(balances, [network, 'available']) || 0;
                                const onOrder = safeAccess(balances, [network, 'onOrder']) || 0;
                                filteredBalances[network] = { balance: add(available, onOrder) };
                            }
                        }
                        resolve(filteredBalances);
                    }
                });
            });
        } catch (err) {
            logError('BINANCE_GET_BALANCE_ERROR', err);
            return false;
        }
    }

    fixPrecision(quote, quantity) {
        const precision = safeAccess(AppConfig, ['BINANCE', 'PRECISION', quote]);

        if (precision) {
            return toFixed(divDecimals(quantity, Config[quote].decimals), precision);
        }
    }

    async getPrices(quotes, bases?) {
        try {
            const prices = {};

            if (!bases) {
                bases = quotes;
            }

            return new Promise((resolve, reject) => {
                this.binance.prices((error, ticker) => {
                    if (error) {
                        reject(error);
                    } else {
                        for (const q of quotes) {
                            for (const b of bases) {
                                if (!ticker[b + q] && ticker[q + b]) {
                                    prices[`${b}-${q}`] = div(1, ticker[q + b]).toString();
                                }

                                if (ticker[q + b]) {
                                    prices[`${q}-${b}`] = ticker[q + b];
                                }
                            }
                        }

                        Object.keys(Config.BINANCE.DUPLICATE_PRICE).forEach((t) => {
                            const d = Config.BINANCE.DUPLICATE_PRICE[t];
                            Object.keys(prices).forEach((p) => {
                                prices[p.replace(d, t)] = prices[p];
                            });

                            prices[`${t}-${d}`] = 1;
                            prices[`${d}-${t}`] = 1;
                        });

                        resolve(prices);
                    }
                });
            });
        } catch (err) {
            throw new Error(err);
        }
    }

    formatOrder(order) {
        const quote = Config.BINANCE.DUPLICATE_PRICE[order.quote] || order.quote;
        const base = Config.BINANCE.DUPLICATE_PRICE[order.base] || order.base;

        if (Config.BINANCE.PAIRS[quote + base]) {
            return {
                type: 'marketBuy',
                pair: quote + base,
                quantity: order.buy,
            };
        } else if (Config.BINANCE.PAIRS[base + quote]) {
            return {
                type: 'marketSell',
                pair: base + quote,
                quantity: order.sell,
            };
        }
    }
}
