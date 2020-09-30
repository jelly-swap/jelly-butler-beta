import { NextFunction, Request, Response } from 'express';
import AppConfig from '../../../config';
import getContracts from '../../blockchain/contracts';
import { logInfo } from '../../logger';
import { WithdrawService } from './service';

export class WithdrawController {
    private withdrawService: WithdrawService;

    constructor() {
        this.withdrawService = new WithdrawService();
    }

    public async withdraw(request: Request, response: Response, next: NextFunction) {
        const contracts = getContracts();
        if (AppConfig.COVER_FEES) {
            const { swap, secret } = request.body;
            const result = await contracts[swap.network].userWithdraw(swap, secret);
            logInfo(`USER_WITHDRAW_TX`, result);
            return result;
        } else {
            return false;
        }
    }

    public async newWithdraw(request: Request, response: Response, next: NextFunction) {
        const swap = request.body;
        try {
            const withdrawnSwap = await this.withdrawService.add(swap);
            return withdrawnSwap;
        } catch (error) {
            return error;
        }
    }

    public async findManyByIds(request: Request, response: Response, next: NextFunction) {
        const payload = request.body;

        try {
            const withdrawnSwaps = await this.withdrawService.findManyByIds(payload);

            return withdrawnSwaps;
        } catch (error) {
            return error;
        }
    }
}
