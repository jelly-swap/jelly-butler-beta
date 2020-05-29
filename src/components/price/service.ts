import AppConfig from '../../../config';

import PriceProviders from './provider';
import IPriceProvider from './provider/IPriceProvider';

import { logError, logInfo } from '../../logger';
import { mul, sub, add, toBigNumber } from '../../utils/math';
import UserConfig from '../../config';
import { IUserConfig } from '../../types/UserConfig';
import { safeAccess } from '../../utils';
import { sleep } from '../../blockchain/utils';

export class PriceService {
    private static instance: PriceService;

    private userConfig: IUserConfig;

    private priceProvider: IPriceProvider;

    private prices = {};
    private pricesWithSpreadAndFee = {};

    constructor() {
        if (PriceService.instance) {
            return PriceService.instance;
        }

        this.userConfig = new UserConfig().getUserConfig();

        this.priceProvider = new PriceProviders[this.userConfig.PRICE.PROVIDER]();

        PriceService.instance = this;
    }

    async update(provider?: IPriceProvider, maxTries = 40) {
        try {
            let prices = {};

            if (provider) {
                prices = await provider.getPrices(AppConfig.PRICE.COINS);
            } else {
                prices = await this.priceProvider.getPrices(AppConfig.PRICE.COINS);
            }

            for (const pair in this.userConfig.PAIRS) {
                if (!prices[pair]) {
                    logError(`SUPPORTED_PAIR_MISSING_PRICE: ${pair}`);
                }
            }

            if (Object.values(prices).length > 0) {
                this.setPrices(prices);
                this.setPricesWithSpreadAndFee(prices);
            }
        } catch (err) {
            if (maxTries > 0) {
                await sleep(15000);
                logError('PRICE_SERVICE_DOWN', err);
                logInfo(`Starting new price service: ${this.userConfig.PRICE.PROVIDER}`);
                this.priceProvider = new PriceProviders[this.userConfig.PRICE.PROVIDER]();
                await this.update(this.priceProvider, maxTries - 1);
            } else {
                logInfo(`Shutting down the application after 10 minutes without price provider.`);
                process.exit(-1);
            }
        }
    }

    getPrices() {
        return this.prices;
    }

    getPricesWithSpreadAndFee() {
        return this.pricesWithSpreadAndFee;
    }

    getPairPrice(base: string, quote: string) {
        const prices = this.getPrices();

        const price = prices[`${base}-${quote}`];

        if (price) {
            return toBigNumber(price).toString();
        } else {
            throw new Error('INVALID_PAIR');
        }
    }

    getPairPriceWithSpreadAndFee(base: string, quote: string) {
        const prices = this.getPricesWithSpreadAndFee();

        const price = prices[`${base}-${quote}`];

        if (price) {
            return toBigNumber(price).toString();
        } else {
            throw new Error('INVALID_PAIR');
        }
    }

    setPrices(prices) {
        this.prices = prices;
    }

    setPricesWithSpreadAndFee(prices) {
        const pricesWithSpread = {};

        Object.keys(prices).forEach((pair) => {
            const pairFee = safeAccess(this.userConfig, ['PAIRS', pair, 'FEE']) || 0;
            pricesWithSpread[pair] = mul(prices[pair], sub(1, add(pairFee, AppConfig.FEE)));
        });

        this.pricesWithSpreadAndFee = pricesWithSpread;
    }
}
