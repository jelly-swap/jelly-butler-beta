import { NextFunction, Request, Response } from 'express';
import { PriceService } from './service';

export class PriceController {
    private priceService: PriceService;

    constructor() {
        this.priceService = new PriceService();
    }

    async getPrice(request: Request, response: Response, next: NextFunction) {
        return this.priceService.getPricesWithSpreadAndFee();
    }
}
