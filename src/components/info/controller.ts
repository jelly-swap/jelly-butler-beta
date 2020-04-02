import { NextFunction, Request, Response } from 'express';
import InfoService from './service';

export class InfoController {
    private infoService: InfoService;

    constructor() {
        this.infoService = new InfoService();
    }

    async getInfo(request: Request, response: Response, next: NextFunction) {
        return this.infoService.getInfo();
    }
}
