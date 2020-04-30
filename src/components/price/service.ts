import AppConfig from '../../../config';

import PriceProviders from './provider';
import IPriceProvider from './provider/IPriceProvider';

import { logError, logInfo } from '../../logger';
import Config from '../../blockchain/config';
import { mul, sub, add, toBigNumber, mulDecimals, divDecimals, greaterThan } from '../../utils/math';

export class PriceService {
    private static instance: PriceService;

    private priceProvider: IPriceProvider;
    private fallbackProvider: IPriceProvider;

    private prices = {};
    private pricesWithSpreadAndFee = {};

    constructor() {
        if (PriceService.instance) {
            return PriceService.instance;
        }

        this.priceProvider = new PriceProviders[AppConfig.PRICE.PROVIDER]();

        PriceService.instance = this;
    }

    async update(provider?: IPriceProvider) {
        try {
            let prices = {};

            if (provider) {
                prices = await provider.getPrices(AppConfig.PRICE.COINS);
            } else {
                prices = await this.priceProvider.getPrices(AppConfig.PRICE.COINS);
            }

            if (Object.values(prices).length > 0) {
                this.setPrices(prices);
                this.setPricesWithSpreadAndFee(prices);
            }
        } catch (err) {
            logError('PRICE_SERVICE_DOWN', err);

            if (AppConfig.PRICE.USE_FALLBACK && PriceProviders[AppConfig.PRICE.FALLBACK]) {
                logInfo(`Starting fallback price service: ${AppConfig.PRICE.FALLBACK}`);
                this.priceProvider = new PriceProviders[AppConfig.PRICE.PROVIDER]();
                this.fallbackProvider = new PriceProviders[AppConfig.PRICE.FALLBACK]();
                await this.update(this.fallbackProvider);
            } else {
                // logInfo('Liquidity Node is Shutting Down - No fallback porice provider.......');
                // process.exit(1);
            }
        }
    }

    isInputPriceValid(swap) {
        try {
            const pairPrice = this.getPairPrice(swap.network, swap.outputNetwork);

            const inputDecimals = Config[swap.network].decimals;
            const outputDecimals = Config[swap.outputNetwork].decimals;

            const priceInBig = mulDecimals(pairPrice, outputDecimals);

            const outputAmount = mul(priceInBig, divDecimals(swap.inputAmount, inputDecimals));

            const requestedAmount = mul(
                outputAmount,
                add(
                    1,
                    AppConfig.PRICE.TOLERANCE[swap.network + '-' + swap.outputNetwork] ||
                        AppConfig.PRICE.TOLERANCE.DEFAULT
                )
            );
            const outputAmountWithoutFee = sub(swap.outputAmount, mul(swap.outputAmount, AppConfig.FEE));

            return greaterThan(sub(outputAmountWithoutFee, requestedAmount), 0);
        } catch (err) {
            return false;
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

    setPrices(prices) {
        this.prices = prices;
    }

    setPricesWithSpreadAndFee(prices) {
        const pricesWithSpread = {};

        Object.keys(prices).forEach((pair) => {
            pricesWithSpread[pair] = mul(
                prices[pair],
                sub(1, add(AppConfig.PRICE.SPREAD[pair] || AppConfig.PRICE.SPREAD.DEFAULT, AppConfig.FEE))
            );
        });

        this.pricesWithSpreadAndFee = pricesWithSpread;
    }
}
