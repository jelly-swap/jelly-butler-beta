import { Config } from '@jelly-swap/aeternity';
import AppConfig from '../../../config';

export default {
    ...Config(7200),
    providerUrl: 'https://sdk-mainnet.aepps.com/',
    internalUrl: 'https://sdk-mainnet.aepps.com/',
    compilerUrl: 'https://compiler.aepps.com',
    wsUrl: 'wss://mainnet.aeternal.io/websocket',
    apiUrl: 'https://mainnet.aeternal.io/',
    contractAddress: 'ct_jmRkfpzmn7KZbXbkEL9wueJkb1vaFzMnVFJMFjAnJgj1CTtQe',
    explorer: 'https://explorer.aepps.com/transactions/',
    REFUND_PERIOD: 10,
    //Expiration is in milliseconds
    VALID_EXPIRATION: 72000000,

    receiverAddress: AppConfig.BLOCKCHAIN.AE.ADDRESS,
    KEY_PAIR: AppConfig.BLOCKCHAIN.AE.SECRET,
};
