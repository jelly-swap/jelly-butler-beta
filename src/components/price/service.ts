import AppConfig from '../../../config';

import PriceProviders from './provider';
import IPriceProvider from './provider/IPriceProvider';

import { logError, logInfo } from '../../logger';
import getBlockchainConfig from '../../blockchain/config';
import { mul, sub, add, toBigNumber, mulDecimals, divDecimals, greaterThan } from '../../utils/math';
import UserConfig from '../../config';
import { IUserConfig } from '../../types/UserConfig';
import { safeAccess } from '../../utils';
import { sleep } from '../../blockchain/utils';

export class PriceService {
    private static instance: PriceService;

    private userConfig: IUserConfig;
    private blockchainConfig: any;

    private priceProvider: IPriceProvider;

    private prices = {};
    private pricesWithSpreadAndFee = {};

    constructor() {
        if (PriceService.instance) {
            return PriceService.instance;
        }

        this.blockchainConfig = getBlockchainConfig();
        this.userConfig = new UserConfig().getUserConfig();

        this.priceProvider = new PriceProviders[this.userConfig.PRICE.PROVIDER]();

        PriceService.instance = this;
    }

    async update(provider?: IPriceProvider, maxTries = 5) {
        try {
            let prices = {};

            if (provider) {
                prices = await provider.getPrices(AppConfig.PRICE.COINS);
            } else {
                prices = await this.priceProvider.getPrices(AppConfig.PRICE.COINS);
            }

            let supportedPrices = {};
            for (const pair in this.userConfig.PAIRS) {
                if (prices[pair]) {
                    supportedPrices[pair] = prices[pair];
                } else {
                    logError(`SUPPORTED_PAIR_MISSING_PRICE: ${pair}`);
                }
            }

            if (Object.values(prices).length > 0) {
                this.setPrices(supportedPrices);
                this.setPricesWithSpreadAndFee(supportedPrices);
            }
        } catch (err) {
            if (maxTries > 0) {
                await sleep(2000);
                logError('PRICE_SERVICE_DOWN', err);
                logInfo(`Starting new price service: ${this.userConfig.PRICE.PROVIDER}`);
                this.priceProvider = new PriceProviders[this.userConfig.PRICE.PROVIDER]();
                await this.update(this.priceProvider, maxTries - 1);
            } else {
                logInfo(`Shutting down the application.`);
                process.exit(-1);
            }
        }
    }

    isInputPriceValid(swap) {
        try {
            const pairPrice = this.getPairPriceWithSpreadAndFee(swap.network, swap.outputNetwork);

            const inputDecimals = this.blockchainConfig[swap.network].decimals;
            const outputDecimals = this.blockchainConfig[swap.outputNetwork].decimals;

            //locked Amount
            const lockedAmountSlashed = divDecimals(swap.inputAmount, inputDecimals);

            //Desired Amount
            const desiredAmountSlashed = divDecimals(swap.outputAmount, outputDecimals);

            //Current price 
            const marketActualPrice = mul(lockedAmountSlashed, pairPrice);

            //MAX Allowed Slippage
            const maxAllowedSlippage = mul(marketActualPrice, AppConfig.SLIPPAGE);

            greaterThan(maxAllowedSlippage, sub(desiredAmountSlashed, marketActualPrice));

        } catch (err) {
            return false;
        }
    }

    adjustPrice(swap){
        try{
          const pairPrice = this.getPairPriceWithSpreadAndFee(swap.outputNetwork, swap.network);

          const inputDecimals = this.blockchainConfig[swap.network].decimals;
          const outputDecimals = this.blockchainConfig[swap.outputNetwork].decimals;
          
          // Received amount
          const receivedAmountSlashed = divDecimals(swap.outputAmount, outputDecimals);

          // Send amount
          const sendAmountSlashed = mul(receivedAmountSlashed, pairPrice);

          // Send amount big
          const sendAmountBig = mulDecimals(sendAmountSlashed, inputDecimals);

          return {
              ...swap,
              inputAmount: sendAmountBig,
          };

        }
        catch(err){
            throw new Error('CANNOT ADJUST PAIR PRICE');
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
