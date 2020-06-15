import Config from '../../../../config';

import fetch from 'node-fetch';
import * as CryptoCompareApi from 'cryptocompare';

import IPriceProvider from './IPriceProvider';
import UserConfig from '../../../config';
import AppConfig from '../../../../config';

global.fetch = fetch;

export default class CryptoCompareProvider implements IPriceProvider {
    constructor() {
        const userConfig = new UserConfig().getUserConfig();
        CryptoCompareApi.setApiKey(userConfig.PRICE.API_KEY);
    }

    async getPrices(q, b?) {
        try {
            if (!b) {
                b = q;
            }

            const prices = {};
            const result = await CryptoCompareApi.priceMulti(q, b);

            Object.entries(AppConfig.DUPLICATE_PRICE).forEach((t) => {
                result[t['0']] = result[t['1']];
            });

            Object.keys(result).forEach((base) => {
                Object.keys(result[base]).forEach((quote) => {
                    prices[`${base}-${quote}`] = result[base][quote];
                });
            });

            Object.entries(AppConfig.DUPLICATE_PRICE).forEach((t) => {
                prices[`${t['0']}-${t['1']}`] = 1;
                prices[`${t['1']}-${t['0']}`] = 1;
            });

            return prices;
        } catch (err) {
            throw new Error(err);
        }
    }
}

declare global {
    namespace NodeJS {
        interface Global {
            fetch: any;
        }
    }
}
