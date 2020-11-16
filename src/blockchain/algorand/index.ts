import { Contract, Providers } from '@jelly-swap/algorand';
import AlgorandProvider from '@jelly-swap/algo-provider';

export default class BitcoinContract extends Contract {
    constructor(config) {
        const wallet = new Providers.MnemonicWallet(config.SEED, new AlgorandProvider(config.providerUrl) as any);
        super(wallet, config);
    }

    async newContract(outputSwap) {
        const txHash = await super.newContract(outputSwap);
        if (txHash == 'FAILED') {
            throw new Error('Transaction cannot be broadcasted');
        }
        return txHash;
    }

    async refund(refund) {
        const txHash = await super.refund(refund);

        if (txHash === 'FAILED') {
            throw new Error('ALGO_REFUND_INVALID');
        }

        return txHash;
    }

    async withdraw(withdraw) {
        const txHash = await super.withdraw(withdraw);

        if (txHash === 'FAILED') {
            throw new Error('ALGO_WITHDRAW_INVALID');
        }

        return txHash;
    }

    // TODO: Implement message signing.
    // async signMessage(message: string) {
    // return await this.wallet.signMessage(message);
    // }

    async userWithdraw(__swap, __secret) {
        // Can't do withdraw on user's behalf.
    }
}
