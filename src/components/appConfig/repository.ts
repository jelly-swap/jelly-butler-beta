import Repository from '../../repository';

import { safeAccess } from '../../utils';
import UserConfig from '../../config';

export default class AppConfigRepository {
    private appConfig;

    constructor() {
        const userConfig = new UserConfig().getUserConfig();

        this.appConfig = safeAccess(Repository, [userConfig.DATABASE.ACTIVE, 'appConfig'])();
    }

    getConfig() {
        return this.appConfig.find();
    }

    getConfigById(id) {
        return this.appConfig.findOne(id);
    }

    setInitialConfig() {
        return this.appConfig.save({
            language: 'english',
            theme: 'dark_theme',
            sound: true,
        });
    }

    async updateConfig(id, newConfig) {
        const previousVersion = await this.getConfigById(id);

        return this.appConfig.save({
            id,
            ...previousVersion,
            ...newConfig,
        });
    }
}
