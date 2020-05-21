import { fixHash } from '@jelly-swap/utils';

// Ethereum
import { utils } from 'ethers';

//Bitcoin
import Wallet from '@jelly-swap/btc-web-wallet';
import BitcoinProvider from '@jelly-swap/btc-provider';

// Aeternity
import { Crypto } from '@aeternity/aepp-sdk';
import * as nacl from 'tweetnacl';

export const compareAddress = (a1: string, a2: string) => {
    return a1.toLowerCase() === a2.toLowerCase();
};

export const sleep = (msec: number) => {
    return new Promise((resolve) => setTimeout(resolve, msec));
};

export const ethAddressMatch = async (privateKey, address) => {
    return utils.computeAddress(fixHash(privateKey, true)).toLowerCase() === address.toLowerCase();
};

export const btcAddressMatch = async (mnemonic, address) => {
    try {
        const wallet = new Wallet(mnemonic, new BitcoinProvider(''));
        const btcAddress = await wallet.getWalletAddress(address);
        return btcAddress.address.toLowerCase() === address.toLowerCase();
    } catch (err) {
        return false;
    }
};

export const aeAddressMatch = async (privateKey, address) => {
    const keys = nacl.sign.keyPair.fromSecretKey(Buffer.from(privateKey, 'hex'));
    const publicBuffer = Buffer.from(keys.publicKey);
    return `ak_${Crypto.encodeBase58Check(publicBuffer)}` === address;
};

export const PK_MATCH_ADDRESS = {
    ETH: ethAddressMatch,
    DAI: ethAddressMatch,
    USDC: ethAddressMatch,
    WBTC: ethAddressMatch,
    BTC: btcAddressMatch,
    AE: aeAddressMatch,
};
