import { Contract, Providers } from '@jelly-swap/erc20';

import Emitter from '../../emitter';
import EmailService from '../../email';

import { greaterThan } from '../../utils/math';
import { logInfo, logError } from '../../logger';

export default class Erc20Contract extends Contract {
    private emailService: EmailService;
    private filter: any;

    constructor(config) {
        super(new Providers.WalletProvider(config.PRIVATE_KEY, config.providerUrl), config);
        this.emailService = new EmailService();

        this.filter = {
            new: {
                receiver: this.config.receiverAddress,
            },
            withdraw: {
                sender: this.config.receiverAddress,
            },
        };
    }

    subscribe() {
        logInfo(`Starting ERC20 Events - ${this.config.contractAddress}`);
        super.subscribe(onMessage, this.filter);
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
                const events = await this.getPast('new', { new: { sender: this.config.receiverAddress } });
                for (const event of events) {
                    try {
                        if (event.status === 4) {
                            logInfo(`REFUND ERC20: ${event.id}`);
                            transactionHash = await super.refund(event);
                            this.emailService.send('REFUND', { ...event, transactionHash });
                        }
                    } catch (err) {
                        logError(`ERC20_REFUND_ERROR: ${err} ${event}`);
                    }
                }
            } catch (err) {
                logError(`ERC20_REFUND_ERROR: ${err}`);
            }
        };

        setInterval(async () => {
            await process();
        }, this.config.REFUND_PERIOD * 1000 * 60);
    }
}

const onMessage = (result) => {
    new Emitter().emit(result.eventName, result);
};
