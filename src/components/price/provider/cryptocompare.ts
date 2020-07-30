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
                const duplicate = t['0'];
                const from = t['1'];
                if (!result[duplicate]) {
                    result[duplicate] = result[from];
                }
            });

            Object.keys(result).forEach((base) => {
                Object.keys(result[base]).forEach((quote) => {
                    prices[`${base}-${quote}`] = result[base][quote];
                });
            });

            Object.entries(AppConfig.DUPLICATE_PRICE).forEach((t) => {
                const b = t['0'];
                const q = t['1'];

                if (!prices[`${b}-${q}`]) {
                    prices[`${b}-${q}`] = 1;
                }

                if (!prices[`${q}-${b}`]) {
                    prices[`${q}-${b}`] = 1;
                }
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
