import { Contract, Providers } from '@jelly-swap/tron';

import { compareAddress } from '../utils';

import Emitter from '../../emitter';
import { logInfo, logError } from '../../logger';
import EmailService from '../../email';

export default class TronContract extends Contract {
    private emailService: EmailService;

    constructor(config) {
        const provider = new Providers.WalletProvider(config.PRIVATE_KEY, config.providerUrl);
        super(provider, config);
        this.emailService = new EmailService();
    }

    async subscribe() {
        logInfo(`Starting TRON Events`);
        super.subscribe(onMessage, result => filter(result, 'receiver', this.config.receiverAddress));
    }

    async getAccount(address) {
        return await this.provider.tronWeb.trx.getAccount(address);
    }

    async getPast(type, user = 'receiver', receiver = this.config.receiverAddress) {
        return await super.getPastEvents(type, result => filter(result, user, receiver));
    }

    async userWithdraw(swap, secret) {
        const address = swap.receiver;

        const account = await this.getAccount(address);

        if (Object.values(account).length === 0) {
            await this.provider.tronWeb.trx.sendTransaction(address, 100000, this.config.PRIVATE_KEY);
            return await this.withdraw({ ...swap, secret });
        }
    }

    async processRefunds() {
        const process = async () => {
            logInfo('START TRX REFUNDS');

            let transactionHash;
            try {
                const events = await this.getPast('new', 'sender');

                for (const event of events) {
                    if (event.status === 4) {
                        logInfo(`REFUND TRX: ${event.id}`);
                        transactionHash = await super.refund(event);
                        this.emailService.send('REFUND', { ...event, transactionHash });
                    }
                }
            } catch (err) {
                logError(`TRX_REFUND_ERROR: ${err}`);
            }
        };

        setInterval(async () => {
            await process();
        }, this.config.REFUND_PERIOD * 1000 * 60);
    }
}

const onMessage = result => {
    const emitter = new Emitter();
    emitter.emit(result.eventName, result);
};

const filter = (result, user = 'receiver', receiver) => {
    switch (result.eventName) {
        case 'NEW_CONTRACT': {
            if (compareAddress(result[user], receiver)) {
                return result;
            }
            break;
        }

        case 'REFUND': {
            return result;
        }

        case 'WITHDRAW': {
            if (compareAddress(result.sender, receiver)) {
                return result;
            }
            break;
        }
    }
};
