import { Contract } from '@jelly-swap/avalanche';
import { WalletProvider } from '@jelly-swap/avalanche/dist/src/providers';

import { greaterThan } from '../../utils/math';

const DEFAULT_OPTIONS = { gasPrice: '0x6D6E2EDC00', gasLimit: 350000 };

export default class XinfinContract extends Contract {
    private wallet: WalletProvider;

    constructor(config) {
        const _wallet = new WalletProvider(config.PRIVATE_KEY, config);
        super(_wallet, config);
        this.wallet = _wallet;
    }

    async newContract(swap) {
        return await super.newContract(swap, DEFAULT_OPTIONS);
    }

    async withdraw(withdraw) {
        return await super.withdraw(withdraw, DEFAULT_OPTIONS);
    }

    async refund(refund) {
        return await super.refund(refund, DEFAULT_OPTIONS);
    }

    async signMessage(message: string) {
        return await this.wallet.signMessage(message);
    }

    async userWithdraw(swap, secret) {
        const address = swap.receiver;
        const balance = await super.getBalance(address);
        const isBalanceZero = greaterThan(balance, 0);

        if (!isBalanceZero) {
            const result = await super.withdraw({ ...swap, secret }, DEFAULT_OPTIONS);
            return result;
        }
    }
}
