import getContracts, { getNetworkContracts } from '../contracts';
import { sleep } from '../utils';

import { logInfo, logError, logWarn } from '../../logger';

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
    private localCache: any;

    constructor() {
        this.swapService = new SwapService();
        this.withdrawService = new WithdrawService();
        this.emailService = new EmailService();
        this.contracts = getContracts();
        this.localCache = {};
    }

    async onWithdraw(withdraw, maxTries = RETRY_COUNT) {
        logInfo('ON_WITHDRAW', withdraw);

        const swap = await this.swapService.findInputSwapByOutputSwapIdAndOutputNetwork(withdraw.id, withdraw.network);

        if (swap) {
            const contract = this.contracts[swap.network];
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

                            await this.emailService.send('WITHDRAW', {
                                ...swap,
                                transactionHash,
                                secret: withdraw.secret,
                            });
                        } catch (err) {
                            logError(`WITHDRAW_SERVICE_ERROR: ${err}`);
                        }
                    } catch (err) {
                        this.localCache[withdraw.id] = false;

                        logError('WITHDRAW_BROADCAST_ERROR', withdraw.id);
                        logError(`WITHDRAW_ERROR`, err);

                        if (maxTries > 0) {
                            logInfo('WITHDRAW_RETRY', withdraw.id);
                            await sleep((RETRY_COUNT + 1 - maxTries) * RETRY_TIME);
                            await this.onWithdraw(withdraw, maxTries - 1);
                        } else {
                            logError('WITHDRAW_FAILED', withdraw.id);
                        }
                    }
                } else {
                    logWarn('WITHDRAW_ALREADY_PROCESSED', withdraw.id);
                }
            }
        } else {
            logWarn('WITHDRAW_SWAP_NOT_FOUND', withdraw.id);
        }
    }

    async processOldWithdraws(withdraws) {
        logInfo(`TRACK_OLD_WITHDRAWS`);

        try {
            for (const index in withdraws) {
                const withdraw = withdraws[index];

                const isProcessed = await this.withdrawService.findByIdAndNetwork(withdraw.id, withdraw.network);

                if (!isProcessed) {
                    this.onWithdraw(withdraw);
                }
            }
        } catch (err) {
            logError(`TRACK_OLD_WITHDRAWS_PROCESSING_ERROR`, { err });
        }
    }
}
