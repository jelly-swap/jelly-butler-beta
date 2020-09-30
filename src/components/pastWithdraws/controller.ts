import { NextFunction, Request, Response } from 'express';
import { PastWithdrawsService } from './service';

export class PastWithdrawsController {
    private pastWithdraws: PastWithdrawsService;

    constructor() {
        this.pastWithdraws = new PastWithdrawsService();
    }

    async getPast(request: Request, response: Response, next: NextFunction) {
        return this.pastWithdraws.getPast();
    }
}
