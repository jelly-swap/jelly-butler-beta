import { Contract } from '@jelly-swap/bitcoin';
import { Wallet } from '@jelly-swap/btc-wallet';
import { BitcoinProvider } from '@jelly-swap/btc-provider';

import { compareAddress } from '../utils';

import Emitter from '../../emitter';
import { logInfo, logError } from '../../logger';
import EmailService from '../../email';

export default class BitcoinContract extends Contract {
    private emailService: EmailService;

    constructor(config) {
        const provider = new BitcoinProvider(config.providerUrl);
        const wallet = new Wallet(config.NETWORK, config.SEED, 'bech32', provider);
        super(wallet, config, config.NETWORK);
        this.emailService = new EmailService();
    }

    async newContract(outputSwap) {
        const txHash = await super.newContract(outputSwap);
        if (txHash == 'Swap failed.') {
            throw new Error('transaction cannot be broadcasted');
        }
        return txHash;
    }

    subscribe() {
        logInfo(`Starting BTC Events`);
        super.subscribe(
            type => onMessage(type, this.config.receiverAddress),
            type => subscribeFilter(type, this.config.receiverAddress)
        );
    }

    // Mock in order to enable withdraw tracker for BTC
    async getStatus(ids) {
        return ids.map(() => 1);
    }

    async getPast(type, __user?, receiver = this.config.receiverAddress) {
        switch (type) {
            case 'new': {
                const events = await super.getPastEvents('new', () => {
                    return {
                        type: 'getSwapsByReceiver',
                        address: receiver,
                    };
                });

                if (events instanceof Array) {
                    const result = events.reduce((result, event) => {
                        if (event.blockHeight !== -1) {
                            result.push({ ...event, isSender: true });
                        }

                        return result;
                    }, []);

                    return result;
                }
            }

            case 'withdraw': {
                return await super.getPastEvents('withdraw', () => {
                    return {
                        type: 'getWithdrawBySender',
                        address: receiver,
                    };
                });
            }

            default: {
                break;
            }
        }
    }

    async processRefunds() {
        const blockNumber = await this.getCurrentBlock();

        const process = async () => {
            logInfo('START BTC REFUNDS');

            let transactionHash;
            try {
                const events = await super.getPastEvents('new', () => {
                    return {
                        type: 'getExpiredSwaps',
                        address: this.config.receiverAddress,
                        startBlock: Number(blockNumber) - 10000,
                        endBlock: blockNumber,
                    };
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

const subscribeFilter = (type, receiver) => {
    switch (type) {
        case 'new': {
            return () => {
                return {
                    type: 'getSwapsByReceiverAndBlock',
                    address: receiver,
                };
            };
        }

        case 'withdraw': {
            return () => {
                return {
                    type: 'getWithdrawBySenderAndBlock',
                    address: receiver,
                };
            };
        }

        default: {
            break;
        }
    }
};

const onMessage = (type, receiver) => {
    const emitter = new Emitter();

    switch (type) {
        case 'NEW_CONTRACT': {
            return result => {
                if (compareAddress(result.receiver, receiver)) {
                    if (result.blockHeight !== -1) {
                        emitter.emit('NEW_CONTRACT', result);
                    }
                }
            };
        }

        case 'WITHDRAW': {
            return result => {
                if (compareAddress(result.sender, receiver)) {
                    emitter.emit('WITHDRAW', result);
                }
            };
        }

        default: {
            break;
        }
    }
};
