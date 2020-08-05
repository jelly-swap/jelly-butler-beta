import IPriceProvider from './IPriceProvider';

export default class TestnetPriceProvider implements IPriceProvider {
    async getPrices(q, b?) {
        return {
            'AVAX-ETH': 0.2,
            'ETH-AVAX': 5,

            // USDC prices
            'AVAX-USDC': 5,
            'ETH-USDC': 350,

            'AVAX-USDT': 5,
            'ETH-USDT': 350,
        };
    }
}
