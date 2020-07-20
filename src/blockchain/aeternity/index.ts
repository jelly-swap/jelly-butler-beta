import { Contract, Providers } from '@jelly-swap/aeternity';
import { fixHash } from '@jelly-swap/utils';
import { Filter } from '@jelly-swap/types';

import Emitter from '../../emitter';
import { greaterThan } from '../../utils/math';
import { logInfo, logError } from '../../logger';
import EmailService from '../../email';

export default class AeternityContract extends Contract {
    private emailService: EmailService;
    private filter: Filter;

    constructor(config) {
        super(new Providers.HTTP(config, config.KEY_PAIR), config);
        this.emailService = new EmailService();
    }

    async getPast(type, filter = this.filter) {
        return await super.getPastEvents(type, filter);
    }

    async getStatus(ids) {
        const fixedIds = ids.map((i) => fixHash(i, false));
        return await super.getStatus(fixedIds);
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
            logInfo('START AE REFUNDS');

            try {
                let transactionHash;
                const events = await this.getPast('new', { new: { sender: this.config.receiverAddress } });
                for (const event of events) {
                    try {
                        if (event.status === 4) {
                            logInfo(`REFUND AE: ${event.id}`);
                            transactionHash = await super.refund(event);
                            transactionHash =
                                typeof transactionHash == 'object' ? transactionHash.hash : transactionHash;
                            this.emailService.send('REFUND', { ...event, transactionHash });
                        }
                    } catch (err) {
                        logError(`AE_REFUND_ERROR`, { err, event });
                    }
                }
            } catch (err) {
                logError(`AE_REFUND_ERROR`, err);
            }
        };

        setInterval(async () => {
            await process();
        }, this.config.REFUND_PERIOD * 1000 * 60);
    }
}
