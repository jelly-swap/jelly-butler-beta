import Config from '../../../../config';

import fetch from 'node-fetch';
import * as CryptoCompareApi from 'cryptocompare';

import IPriceProvider from './IPriceProvider';
import UserConfig from '../../../config';

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

            Object.keys(result).forEach((base) => {
                Object.keys(result[base]).forEach((quote) => {
                    prices[`${base}-${quote}`] = result[base][quote];
                });
            });

            return prices;
        } catch (err) {
            console.log(err);
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
