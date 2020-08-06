import IPriceProvider from './IPriceProvider';

export default class TestnetPriceProvider implements IPriceProvider {
    async getPrices(q, b?) {
        return {
            'AVAX-ETH': 0.2,
            'ETH-AVAX': 5,

            'ONE-ETH': 0.01,
            'ETH-ONE': 100,

            // USDC prices
            'AVAX-USDC': 5,
            'ETH-USDC': 350,
            'ONE-USDC': 0.02,

            'AVAX-USDT': 5,
            'ETH-USDT': 350,
            'ONE-USDT': 0.02,
        };
    }
}
