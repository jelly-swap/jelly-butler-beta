import { Config } from '@jelly-swap/tron';
import AppConfig from '../../../config';

export default {
    ...Config(3600),
    providerUrl: 'https://api.shasta.trongrid.io/',
    contractAddress: 'TPASPFmeWcPcF5CR668P5dgrzK99ELb3pV',
    REFUND_PERIOD: 20,
    VALID_EXPIRATION: 72000,

    receiverAddress: AppConfig.BLOCKCHAIN.TRX.ADDRESS || 'TPMU6WL5yhDEiKkiifT4P8dK979AsB47PU',
    PRIVATE_KEY: AppConfig.BLOCKCHAIN.TRX.SECRET || 'd3b4f5cd98cbfb4fe7cd7fa24d1168c952d89f145fd5a8464228566c359b2fe4',
};
