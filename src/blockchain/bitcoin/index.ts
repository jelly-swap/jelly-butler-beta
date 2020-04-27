import { Contract } from '@jelly-swap/bitcoin';
import { Wallet } from '@jelly-swap/btc-web-wallet';
import { BitcoinProvider } from '@jelly-swap/btc-provider';

import Emitter from '../../emitter';
import { logInfo, logError } from '../../logger';
import EmailService from '../../email';

export default class BitcoinContract extends Contract {
    private emailService: EmailService;

    constructor(config) {
        const provider = new BitcoinProvider(config.providerUrl);
        const wallet = new Wallet(config.SEED, provider, config.NETWORK, 'bech32');
        super(wallet, config);
        this.emailService = new EmailService();
    }

    async newContract(outputSwap) {
        const txHash = await super.newContract(outputSwap);
        if (txHash == 'Swap failed.') {
            throw new Error('Transaction cannot be broadcasted');
        }
        return txHash;
    }

    subscribe() {
        logInfo(`Starting BTC Events`);
        super.subscribe(onMessage, {
            new: {
                type: 'getSwapsByReceiverAndBlock',
                address: this.config.receiverAddress,
            },
            withdraw: {
                type: 'getWithdrawBySenderAndBlock',
                address: this.config.receiverAddress,
            },
        });
    }

    async getPast(type, __user?, receiver = this.config.receiverAddress) {
        return await super.getPastEvents(type, {
            new: {
                type: 'getSwapsByReceiver',
                address: receiver,
            },
            withdraw: {
                type: 'getWithdrawBySender',
                address: receiver,
            },
        });
    }

    async processRefunds() {
        const blockNumber = await this.getCurrentBlock();

        const process = async () => {
            logInfo('START BTC REFUNDS');

            let transactionHash;

            try {
                const events = await super.getPastEvents('new', {
                    new: {
                        type: 'getExpiredSwaps',
                        address: this.config.receiverAddress,
                        startBlock: Number(blockNumber) - 10000,
                        endBlock: blockNumber,
                    },
                });

                for (const event of events) {
                    if (event.status === 4) {
                        logInfo(`REFUND BTC: ${event.id}`);

                        transactionHash = await super.refund(event);

                        if (transactionHash == 'Swap failed.') {
                            logInfo(`Refund cannot be executed still!`);
                        } else {
                            this.emailService.send('REFUND', { ...event, transactionHash });
                        }
                    }
                }
            } catch (err) {
                logError(`BTC_REFUND_ERROR: ${err}`);
            }
        };

        setInterval(async () => {
            await process();
        }, this.config.REFUND_PERIOD * 1000 * 60);
    }

    async userWithdraw(__swap, __secret) {
        // Can't do withdraw on user's behalf.
    }

    async isValidForRefund() {
        return true;
    }
}

const onMessage = (result) => {
    new Emitter().emit(result.eventName, result);
};
