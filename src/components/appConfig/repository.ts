import { getRepository } from 'typeorm';

import AppConfig from '../../entity/sql/appConfig';

export default class AppConfigRepository {
    private appConfigRepository;

    constructor() {
        this.appConfigRepository = getRepository(AppConfig);
    }

    getConfig() {
        return this.appConfigRepository.findOne();
    }

    setInitialConfig() {
        return this.appConfigRepository.save({});
    }

    async updateConfig(newConfig) {
        const config = await this.getConfig();

        await this.appConfigRepository.update(config.id, newConfig);

        return this.getConfig();
    }
}
