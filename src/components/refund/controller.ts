import { NextFunction, Request, Response } from 'express';
import RefundService from './service';

export class RefundController {
    private refundService: RefundService;

    constructor() {
        this.refundService = new RefundService();
    }

    public async create(request: Request, response: Response, next: NextFunction) {
        try {
            const refund = request.body;
            const created = await this.refundService.add(refund);

            return created;
        } catch (error) {
            return error;
        }
    }

    public async findManyByIds(request: Request, response: Response, next: NextFunction) {
        const ids = request.body.ids;

        try {
            if (!ids) {
                return 'Error missing body';
            }

            const refundedSwaps = await this.refundService.findManyByIds(ids);

            return refundedSwaps;
        } catch (error) {
            return error;
        }
    }
}
