import { Contract } from '@jelly-swap/harmony';
import { WalletProvider } from '@jelly-swap/harmony/dist/src/providers';
import { greaterThan } from '../../utils/math';

export default class EthereumContract extends Contract {
    private wallet: WalletProvider;

    constructor(config) {
        const _wallet = new WalletProvider(config.providerUrl, config.chainId, config.PRIVATE_KEY);
        super(_wallet, config);
        this.wallet = _wallet;
    }

    // TODO: Implement message signing.
    // async signMessage(message: string) {
    // return await this.wallet.signMessage(message);
    // }

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
