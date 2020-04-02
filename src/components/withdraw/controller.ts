import { NextFunction, Request, Response } from 'express';
import AppConfig from '../../../config';
import Contracts from '../../blockchain/contracts';
import { logInfo } from '../../logger';

export class WithdrawController {
    async withdraw(request: Request, response: Response, next: NextFunction) {
        if (AppConfig.COVER_FEES) {
            const { swap, secret } = request.body;
            const result = await Contracts[swap.network].userWithdraw(swap, secret);
            logInfo(`USER_WITHDRAW_TX: ${result}`);
            return result;
        } else {
            return false;
        }
    }
}
