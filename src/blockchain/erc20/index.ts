import { Contract } from '@jelly-swap/erc20';
import { WalletProvider } from '@jelly-swap/ethereum/dist/providers';

import Emitter from '../../emitter';
import EmailService from '../../email';

import { greaterThan } from '../../utils/math';
import { logInfo, logError } from '../../logger';

import { SECONDARY_NETWORKS } from '../config';
import UserConfig from '../../config';

export default class Erc20Contract extends Contract {
    private emailService: EmailService;
    private wallet: WalletProvider;

    private receivers: string[];
    private filter: any;

    constructor(config) {
        const _wallet = new WalletProvider(config.PRIVATE_KEY, config.providerUrl);
        super(_wallet, config);
        this.wallet = _wallet;
        this.emailService = new EmailService();
        this.receivers = new UserConfig().getReceivers(Object.keys(SECONDARY_NETWORKS));
    }

    async signMessage(message: string) {
        return await this.wallet.signMessage(message);
    }

    async getPast(type, filter = this.filter) {
        return await super.getPastEvents(type, filter);
    }

    async withdraw(withdraw) {
        if (!withdraw.tokenAddress) {
            withdraw.tokenAddress = this.config.TokenToAddress(withdraw.network);
        }

        return await super.withdraw(withdraw);
    }

    async userWithdraw(swap, secret) {
        const address = swap.receiver;
        const balance = await this.provider.getBalance(address);
        const isBalanceZero = greaterThan(balance, 0);

        if (!isBalanceZero) {
            const result = await this.withdraw({ ...swap, secret });
            return result;
        }
    }

    async processRefunds() {
        const process = async () => {
            logInfo('START ERC20 REFUNDS');
            try {
                let transactionHash;
                const events = await this.getPast('new', { new: { sender: this.receivers } });
                for (const event of events) {
                    try {
                        if (event.status === 4) {
                            logInfo(`REFUND ERC20: ${event.id}`);
                            transactionHash = await super.refund(event);
                            this.emailService.send('REFUND', { ...event, transactionHash });
                        }
                    } catch (err) {
                        logError(`ERC20_REFUND_ERROR`, { err, event });
                    }
                }
            } catch (err) {
                logError(`ERC20_REFUND_ERROR`, err);
            }
        };

        setInterval(async () => {
            await process();
        }, this.config.REFUND_PERIOD * 1000 * 60);
    }
}
