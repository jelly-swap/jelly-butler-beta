import CryptoCompareProvider from './cryptocompare';
import BinanceProvider from './binance';
import TestnetPriceProvider from './testnet';

export default {
    CryptoCompare: CryptoCompareProvider,
    Binance: BinanceProvider,
    Testnet: TestnetPriceProvider,
};
