import { Contract } from '@jelly-swap/ethereum';
import { WalletProvider } from '@jelly-swap/ethereum/dist/providers';

import Emitter from '../../emitter';
import { greaterThan } from '../../utils/math';
import { logInfo, logError } from '../../logger';
import EmailService from '../../email';

export default class EthereumContract extends Contract {
    private emailService: EmailService;
    private wallet: WalletProvider;
    private filter: any;

    constructor(config) {
        const _wallet = new WalletProvider(config.PRIVATE_KEY, config.providerUrl);
        super(_wallet, config);
        this.wallet = _wallet;
        this.emailService = new EmailService();
    }

    async signMessage(message: string) {
        return await this.wallet.signMessage(message);
    }

    async getPast(type: string, filter = this.filter) {
        return super.getPastEvents(type, filter);
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

    async processRefunds() {
        const process = async () => {
            logInfo('START ETH REFUNDS');
            try {
                let transactionHash;
                const swaps = await this.getPast('new', { new: { sender: this.config.receiverAddress } });

                for (const event of swaps) {
                    try {
                        if (event.status === 4) {
                            logInfo(`REFUND ETH: ${event.id}`);
                            transactionHash = await super.refund(event);
                            this.emailService.send('REFUND', { ...event, transactionHash });
                        }
                    } catch (err) {
                        logError(`ETH_REFUND_ERROR`, { err, event });
                    }
                }
            } catch (err) {
                logError(`ETH_REFUND_ERROR`, err);
            }
        };

        setInterval(async () => {
            await process();
        }, this.config.REFUND_PERIOD * 1000 * 60);
    }
}
