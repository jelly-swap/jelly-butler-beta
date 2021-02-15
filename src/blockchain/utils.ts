import { fixHash } from '@jelly-swap/utils';
import Adapters from './adapters';

// Ethereum
import { utils } from 'ethers';

//Bitcoin
import Wallet from '@jelly-swap/btc-web-wallet';
import BitcoinProvider from '@jelly-swap/btc-provider';

// Aeternity
import { Crypto } from '@aeternity/aepp-sdk';
import * as nacl from 'tweetnacl';

// Harmony
import { WalletProvider } from '@jelly-swap/harmony/dist/src/providers';
import { SECONDARY_NETWORKS } from './erc20/config';

export const compareAddress = (a1: string, a2: string) => {
    return a1.toLowerCase() === a2.toLowerCase();
};

export const sleep = (msec: number) => {
    return new Promise((resolve) => setTimeout(resolve, msec));
};

export const ethAddressMatch = async (privateKey, address) => {
    return compareAddress(utils.computeAddress(fixHash(privateKey, true)), address);
};

export const xdcAddressMatch = async (privateKey, address) => {
    return compareAddress(utils.computeAddress(fixHash(privateKey, true)).replace('0x','xdc'), address);
};

export const btcAddressMatch = async (mnemonic, address) => {
    try {
        const wallet = new Wallet(mnemonic, new BitcoinProvider(''));
        const btcAddress = await wallet.getWalletAddress(address);
        return compareAddress(btcAddress.address, address);
    } catch (err) {
        return false;
    }
};

export const oneAddressMatch = async (privateKey, address) => {
    const wallet = new WalletProvider(undefined, privateKey).addByPrivateKey(privateKey);
    const bech32Address = Adapters()['ONE'].parseAddress(wallet.address);
    return compareAddress(address, bech32Address);
};

export const aeAddressMatch = async (privateKey, address) => {
    const keys = nacl.sign.keyPair.fromSecretKey(Buffer.from(privateKey, 'hex'));
    const publicBuffer = Buffer.from(keys.publicKey);
    return `ak_${Crypto.encodeBase58Check(publicBuffer)}` === address;
};

const getErc20Matcher = () => {
    return Object.keys(SECONDARY_NETWORKS).reduce((object, token) => {
        object[token] = ethAddressMatch;
        return object;
    }, {});
};

export const PK_MATCH_ADDRESS = {
    ...getErc20Matcher(),
    ETH: ethAddressMatch,
    BTC: btcAddressMatch,
    AE: aeAddressMatch,
    ONE: oneAddressMatch,
    MATIC: ethAddressMatch,
    AVAX: ethAddressMatch,
    BNB: ethAddressMatch,
    XDC: ethAddressMatch,
};
