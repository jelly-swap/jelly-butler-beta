import { NextFunction, Request, Response } from 'express';
import { AppConfigService } from './service';

export class AppConfig {
    private appConfig: AppConfigService;

    constructor() {
        this.appConfig = new AppConfigService();
    }

    async getConfig(request: Request, response: Response, next: NextFunction) {
        const appConfig = await this.appConfig.getConfig();

        try {
            return appConfig;
        } catch (error) {
            return error;
        }
    }

    async updateConfig(request: Request, response: Response, next: NextFunction) {
        const newConfig = request.body;

        try {
            const appConfig = await this.appConfig.updateConfig(newConfig);

            console.log(appConfig);

            return appConfig;
        } catch (error) {
            return error;
        }
    }
}
