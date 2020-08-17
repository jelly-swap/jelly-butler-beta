import { Contract } from '@jelly-swap/harmony';
import { WalletProvider } from '@jelly-swap/harmony/dist/src/providers';

export default class EthereumContract extends Contract {
    private wallet: WalletProvider;

    constructor(config) {
        const _wallet = new WalletProvider(config.providerUrl, config.PRIVATE_KEY);
        super(_wallet, config);
        this.wallet = _wallet;
    }

    // TODO: Implement message signing.
    // async signMessage(message: string) {
    // return await this.wallet.signMessage(message);
    // }
}
