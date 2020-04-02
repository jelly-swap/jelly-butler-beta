import IPriceProvider from './IPriceProvider';
import BinanceExchange from '../../../exchange/binance';

export default class BinanceProvider implements IPriceProvider {
    private static instance: BinanceProvider;

    private binance: BinanceExchange;

    constructor() {
        if (BinanceProvider.instance) {
            return BinanceProvider.instance;
        }

        this.binance = new BinanceExchange();

        BinanceProvider.instance = this;
    }

    async getPrices(quotes, bases?) {
        return this.binance.getPrices(quotes, bases);
    }
}
