import { NextFunction, Request, Response } from 'express';
import PendingService from './service';

export class PendingController {
    private pendingService: PendingService;

    constructor() {
        this.pendingService = new PendingService();
    }

    public async create(request: Request, response: Response, next: NextFunction) {
        try {
            const pending = request.body;
            const created = await this.pendingService.add(pending);

            return created;
        } catch (error) {
            return error;
        }
    }

    public async findManyByIds(request: Request, response: Response, next: NextFunction) {
        const ids = request.body.ids;

        try {
            if (!ids) {
                return 'Error ids missing';
            }

            const pendingSwaps = await this.pendingService.findManyByIds(ids);

            return pendingSwaps;
        } catch (error) {
            return error;
        }
    }
}
