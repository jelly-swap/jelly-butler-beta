import SwapHandler from './swap';
import WithdrawHandler from './withdraw';
import Emitter from '../../emitter';
import RefundHandler from './refund';

export const startHandlers = async () => {
    const emitter = new Emitter();

    const swapHandler = new SwapHandler();
    const withdrawHandler = new WithdrawHandler();
    const refundHandler = new RefundHandler();

    emitter.on('NEW_CONTRACT', async (swap) => await swapHandler.onSwap(swap));

    emitter.on('WITHDRAW', async (withdraw) => await withdrawHandler.onWithdraw(withdraw));

    emitter.on('PROCESS_PAST_SWAPS', async ({ activeSwaps, withdraws, expiredSwaps }) => {
        await swapHandler.processOldSwaps(activeSwaps);
        await withdrawHandler.processOldWithdraws(withdraws);
        await refundHandler.processRefunds(expiredSwaps);
    });
};
