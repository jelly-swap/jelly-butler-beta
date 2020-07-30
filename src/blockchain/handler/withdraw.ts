import getContracts from '../contracts';
import getAdapters from '../adapters';
import { sleep } from '../utils';

import { logInfo, logData, logDebug } from '../../logger';

import { SwapService } from '../../components/swap/service';
import { WithdrawService } from '../../components/withdraw/service';

import { validateWithdraw } from '../validator';
import EmailService from '../../email';

const RETRY_COUNT = 10;
const RETRY_TIME = 1000 * 10;

export default class WithdrawHandler {
    private swapService: SwapService;
    private withdrawService: WithdrawService;
    private emailService: EmailService;

    private contracts: any;
    private adapters: any;
    private localCache: any;

    constructor() {
        this.swapService = new SwapService();
        this.withdrawService = new WithdrawService();
        this.emailService = new EmailService();
        this.contracts = getContracts();
        this.adapters = getAdapters();

        this.localCache = {};
    }

    async onWithdraw(withdraw, maxTries = RETRY_COUNT) {
        logInfo('ON_WITHDRAW', withdraw);

        const swap = await this.swapService.findInputSwapByOutputSwapIdAndOutputNetwork(withdraw.id, withdraw.network);

        if (swap) {
            const { network, inputAmount } = swap;

            const contract = this.contracts[network];

            logInfo('WITHDRAW_SWAP_FOUND', swap);

            const valid = await validateWithdraw(withdraw);

            if (valid) {
                const isProcessed = await this.withdrawService.findByIdAndNetwork(withdraw.id, withdraw.network);

                if (!isProcessed && !this.localCache[withdraw.id]) {
                    try {
                        this.localCache[withdraw.id] = true;
                        const result = await contract.withdraw({ ...swap, secret: withdraw.secret });

                        const transactionHash = result.hash || result;

                        try {
                            await this.withdrawService.add(withdraw);

                            logInfo('WITHDRAW_SENT', { ...withdraw, transactionHash });

                            logData(
                                `You received ${this.adapters[network].parseFromNative(
                                    String(inputAmount),
                                    network
                                )} ${network}.`
                            );

                            await this.emailService.send('WITHDRAW', {
                                ...swap,
                                transactionHash,
                                secret: withdraw.secret,
                            });
                        } catch (err) {
                            logDebug(`WITHDRAW_SERVICE_ERROR: ${err}`);
                        }
                    } catch (err) {
                        this.localCache[withdraw.id] = false;

                        logDebug(`WITHDRAW_ERROR ${err}`, err);

                        logDebug('WITHDRAW_BROADCAST_ERROR', withdraw.id);

                        if (maxTries > 0) {
                            logInfo('WITHDRAW_RETRY', withdraw.id);
                            await sleep((RETRY_COUNT + 1 - maxTries) * RETRY_TIME);
                            await this.onWithdraw(withdraw, maxTries - 1);
                        } else {
                            logDebug('WITHDRAW_FAILED', withdraw.id);
                        }
                    }
                } else {
                    logDebug('WITHDRAW_ALREADY_PROCESSED', withdraw.id);
                }
            }
        } else {
            logDebug('WITHDRAW_SWAP_NOT_FOUND', withdraw.id);
        }
    }

    async processOldWithdraws(withdraws) {
        logData(`Checking for missed withdrawals.`);

        try {
            for (const index in withdraws) {
                const withdraw = withdraws[index];

                const isProcessed = await this.withdrawService.findByIdAndNetwork(withdraw.id, withdraw.network);

                if (!isProcessed) {
                    await this.onWithdraw(withdraw);
                }
            }
        } catch (err) {
            logDebug(`TRACK_OLD_WITHDRAWS_PROCESSING_ERROR`, { err });
        }
    }
}
