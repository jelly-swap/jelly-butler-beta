import { Config } from '@jelly-swap/bitcoin';
import { Networks } from '@jelly-swap/btc-utils';

import AppConfig from '../../../config';

export default {
    ...Config(5400),
    providerUrl: 'https://spacejelly.network/btc/api/v1/btc/',
    apiProviderUrl: 'https://spacejelly.network/btc/api/v1/btc/',
    explorer: 'https://blockstream.info/tx/',
    REFUND_PERIOD: 10,
    REFUND_BLOCKS: 500,
    VALID_EXPIRATION: 72000,
    NETWORK: Networks.bitcoin,

    receiverAddress: AppConfig.BLOCKCHAIN.BTC.ADDRESS || 'bc1que7mjd2jpxrckcczh5h3euv7c5ltwaefg356x7',
    REFUND: AppConfig.BLOCKCHAIN.BTC.ADDRESS || 'bc1que7mjd2jpxrckcczh5h3euv7c5ltwaefg356x7',
    SEED: AppConfig.BLOCKCHAIN.BTC.SECRET || '',
};
