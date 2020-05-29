import { NextFunction, Request, Response } from 'express';
import { BalanceService } from './service';

export class BalanceController {
    private balanceService: BalanceService;

    constructor() {
        this.balanceService = new BalanceService();
    }

    async getBalances(request: Request, response: Response, next: NextFunction) {
        return this.balanceService.getBalances();
    }

    async getAllBalances(request: Request, response: Response, next: NextFunction) {
        return this.balanceService.getAllBalances();
    }
}
