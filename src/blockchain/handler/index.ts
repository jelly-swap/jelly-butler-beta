import SwapHandler from './swap';
import WithdrawHandler from './withdraw';
import Emitter from '../../emitter';
import RefundHandler from './refund';

const MINUTES_10 = 10 * 1000 * 60;

export const startHandlers = async () => {
    const emitter = new Emitter();

    const swapHandler = new SwapHandler();
    const withdrawHandler = new WithdrawHandler();
    const refundHandler = new RefundHandler();

    emitter.on('NEW_CONTRACT', async swap => await swapHandler.onSwap(swap));
    emitter.on('WITHDRAW', async withdraw => await withdrawHandler.onWithdraw(withdraw));

    setInterval(async () => {
        await swapHandler.processOldSwaps();
    }, MINUTES_10);

    setInterval(async () => {
        await withdrawHandler.processOldWithdraws();
    }, MINUTES_10);

    await refundHandler.processRefunds();
};
