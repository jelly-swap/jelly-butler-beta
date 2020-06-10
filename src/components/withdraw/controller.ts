import { NextFunction, Request, Response } from 'express';
import AppConfig from '../../../config';
import getContracts from '../../blockchain/contracts';
import { logInfo } from '../../logger';

export class WithdrawController {
    async withdraw(request: Request, response: Response, next: NextFunction) {
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
}
