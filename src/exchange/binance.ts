import Config from '../../config';

import * as Binance from 'node-binance-api';

import IExchange from './IExchange';
import { div, add, toFixed, divDecimals } from '../utils/math';
import { logInfo, logError, logData, logDebug } from '../logger';
import AppConfig from '../../config';
import { safeAccess } from '../utils';
import UserConfig from '../config';

const ORDER_TYPE_TO_LABEL = {
    marketBuy: 'BUY',
    marketSell: 'SELL',
};

export default class BinanceExchange implements IExchange {
    private static Instance: BinanceExchange;

    private binance: any;

    constructor() {
        if (BinanceExchange.Instance) {
            return BinanceExchange.Instance;
        }

        const userConfig = new UserConfig().getUserConfig();

        safeAccess;
        this.binance = Binance().options({
            APIKEY: safeAccess(userConfig, ['EXCHANGE', 'API_KEY']) || safeAccess(userConfig, ['PRICE', 'API_KEY']),
            APISECRET:
                safeAccess(userConfig, ['EXCHANGE', 'SECRET_KEY']) || safeAccess(userConfig, ['PRICE', 'SECRET_KEY']),
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
                    logDebug('BINANCE_ORDER_PLACE_ERROR', err);
                    logError(`Could not place order in Binance for ${quantity} ${pair}`);
                } else {
                    logInfo(`BINANCE_ORDER_PLACED ${pair} ${quantity} ${response.orderId}`);
                    logData(`You placed ${ORDER_TYPE_TO_LABEL[type]} order in Binance for ${quantity} ${pair} `);
                }
            });

            return true;
        } catch (err) {
            logDebug('BINANCE_PLACE_ORDER_ERROR', err);
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
            logDebug('BINANCE_GET_BALANCE_ERROR', err);
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

                        Object.keys(Config.DUPLICATE_PRICE).forEach((t) => {
                            const d = Config.DUPLICATE_PRICE[t];
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
        const quote = Config.DUPLICATE_PRICE[order.quote] || order.quote;
        const base = Config.DUPLICATE_PRICE[order.base] || order.base;

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
