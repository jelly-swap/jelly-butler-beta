import { Contract } from '@jelly-swap/ethereum';
import { WalletProvider, JsonRpcProvider } from '@jelly-swap/ethereum/dist/src/providers';

import { greaterThan } from '../../utils/math';

export default class EthereumContract extends Contract {
    private wallet: WalletProvider | JsonRpcProvider;

    constructor(config) {
        if (config.PRIVATE_KEY) {
            const _wallet = new WalletProvider(config.PRIVATE_KEY, config.providerUrl);
            super(_wallet, config);
            this.wallet = _wallet;
        } else {
            const _wallet = new JsonRpcProvider(config.providerUrl);
            super(_wallet, config);
            this.wallet = _wallet;
        }
    }

    async signMessage(message: string) {
        if (this.wallet instanceof WalletProvider) {
            return await this.wallet.signMessage(message);
        }
    }

    async userWithdraw(swap, secret) {
        const address = swap.receiver;
        const balance = await super.getBalance(address);
        const isBalanceZero = greaterThan(balance, 0);

        if (!isBalanceZero) {
            const result = await super.withdraw({ ...swap, secret });
            return result;
        }
    }
}
