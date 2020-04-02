import { Config } from '@jelly-swap/ethereum';
import AppConfig from '../../../config';

export default {
    ...Config(3600),
    providerUrl: 'https://mainnet.infura.io/v3/ee13a282868d4e7cb7d9a9543958631d',
    contractAddress: '0x471B080EffB2bc6fb33c8c6FE6ce1AB46F9f522b',
    explorer: 'https://etherscan.io/tx/',
    REFUND_PERIOD: 10,
    VALID_EXPIRATION: 72000,

    receiverAddress: AppConfig.BLOCKCHAIN.ETH.ADDRESS,
    PRIVATE_KEY: AppConfig.BLOCKCHAIN.ETH.SECRET,
};
