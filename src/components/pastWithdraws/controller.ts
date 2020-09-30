import { NextFunction, Request, Response } from 'express';
import { PastWithdrawsService } from './service';

export class PastWithdrawsController {
    private pastWithdraws: PastWithdrawsService;

    constructor() {
        this.pastWithdraws = new PastWithdrawsService();
    }

    async getPast(request: Request, response: Response, next: NextFunction) {
        try {
            const pastWithdraws = await this.pastWithdraws.getPast();

            response.status(200).send({ pastWithdraws });
        } catch (error) {
            response.status(500).send({
                error,
            });
        }
    }

    async saveNewId(request: Request, response: Response, next: NextFunction) {
        try {
            const swap = request.body;

            const res = await this.pastWithdraws.saveNewId(swap);

            response.status(500).send({
                res,
            });
        } catch (error) {
            response.status(500).send({
                error,
            });
        }
    }
}
