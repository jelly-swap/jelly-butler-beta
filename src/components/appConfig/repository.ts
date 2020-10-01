import { getRepository } from 'typeorm';

import AppConfig from '../../entity/sql/appConfig';

export default class appConfigRepositoryRepository {
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

    async updateConfig(id, newConfig) {
        const prop = Object.keys(newConfig)[0];

        await this.appConfigRepository.update(id, { [prop]: newConfig[prop] });

        return this.getConfig();
    }
}
