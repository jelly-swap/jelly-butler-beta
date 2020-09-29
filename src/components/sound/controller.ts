import { NextFunction, Request, Response } from 'express';
import SoundService from './service';

export class SoundController {
    private soundService: SoundService;

    constructor() {
        this.soundService = new SoundService();
    }

    async getSound(request: Request, response: Response, next: NextFunction) {
        return this.soundService.getSound();
    }

    async setSound(request: Request, response: Response, next: NextFunction) {
        const { sound } = request.body;

        return this.soundService.setSound();
    }
}
