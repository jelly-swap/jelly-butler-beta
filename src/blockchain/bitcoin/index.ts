import { Contract } from '@jelly-swap/bitcoin';
import { Wallet } from '@jelly-swap/btc-web-wallet';
import { BitcoinProvider } from '@jelly-swap/btc-provider';

export default class BitcoinContract extends Contract {
    constructor(config) {
        const provider = new BitcoinProvider(config.providerUrl);
        const wallet = new Wallet(config.SEED, provider, config.NETWORK, 'bech32');
        super(wallet, config);
    }

    async newContract(outputSwap) {
        const txHash = await super.newContract(outputSwap);
        if (txHash == 'Swap failed.') {
            throw new Error('Transaction cannot be broadcasted');
        }
        return txHash;
    }

    async signMessage(message: string) {
        return this.wallet.signMessage(message, this.config.receiverAddress);
    }

    async userWithdraw(__swap, __secret) {
        // Can't do withdraw on user's behalf.
    }
}
