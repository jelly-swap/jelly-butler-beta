import Contracts from '../contracts';
import { sleep } from '../utils';

import { logInfo, logError } from '../../logger';

import { SwapService } from '../../components/swap/service';
import { WithdrawService } from '../../components/withdraw/service';

import { validateWithdraw } from '../validator';
import EmailService from '../../email';
import Emitter from '../../emitter';
import { equal } from '../../utils/math';

const RETRY_COUNT = 10;
const RETRY_TIME = 1000 * 10;

export default class WithdrawHandler {
    private swapService: SwapService;
    private withdrawService: WithdrawService;
    private emailService: EmailService;

    constructor() {
        this.swapService = new SwapService();
        this.withdrawService = new WithdrawService();
        this.emailService = new EmailService();
    }

    async onWithdraw(withdraw, maxTries = RETRY_COUNT) {
        logInfo('ON_WITHDRAW', withdraw);

        const swap = await this.swapService.findInputSwapByOutputSwapIdAndOutputNetwork(withdraw.id, withdraw.network);

        if (swap) {
            const contract = Contracts[swap.network];
            logInfo('WITHDRAW_SWAP_FOUND', swap);

            const valid = await validateWithdraw(withdraw);

            if (valid) {
                const isProcessed = await this.withdrawService.findByIdAndNetwork(withdraw.id, withdraw.network);

                if (!isProcessed) {
                    try {
                        const result = await contract.withdraw({ ...swap, secret: withdraw.secret });

                        const transactionHash = result.hash || result;

                        await this.withdrawService.add(withdraw);

                        logInfo('WITHDRAW_SENT', { ...withdraw, transactionHash });

                        await this.emailService.send('WITHDRAW', { ...swap, transactionHash, secret: withdraw.secret });
                    } catch (err) {
                        logError('WITHDRAW_BROADCAST_ERROR', withdraw.id);
                        logError(`WITHDRAW_ERROR: ${err}`);

                        if (maxTries > 0) {
                            logInfo('WITHDRAW_RETRY', withdraw.id);
                            await sleep((RETRY_COUNT + 1 - maxTries) * RETRY_TIME);
                            await this.onWithdraw(withdraw, maxTries - 1);
                        } else {
                            logError('WITHDRAW_FAILED', withdraw.id);
                        }
                    }
                } else {
                    logError('WITHDRAW_ALREADY_PROCESSED', withdraw.id);
                }
            }
        } else {
            logError('WITHDRAW_SWAP_NOT_FOUND', withdraw.id);
        }
    }

    async processOldWithdraws() {
        try {
            logInfo(`TRACK_OLD_WITHDRAWS`);

            const emitter = new Emitter();

            for (const network of Object.keys(Contracts)) {
                const contract = Contracts[network];
                const withdraws = await contract.getPast('withdraw');
                const ids = withdraws.map(w => w.id);

                try {
                    const statuses = await contract.getStatus(ids);

                    for (const index in withdraws) {
                        if (equal(statuses[index], 3)) {
                            const withdraw = withdraws[index];

                            const isProcessed = await this.withdrawService.findByIdAndNetwork(
                                withdraw.id,
                                withdraw.network
                            );

                            if (!isProcessed) {
                                emitter.emit('WITHDRAW', withdraw);
                            }
                        }
                    }
                } catch (err) {
                    logError(`TRACK_OLD_WITHDRAWS_PROCESSING_ERROR ${network} ${err}`);
                }
            }
        } catch (err) {
            logError(`TRACK_OLD_WITHDRAWS_ERROR ${err}`);
        }
    }
}
