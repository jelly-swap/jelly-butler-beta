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
        return this.appConfig.findOne();
    }

    setInitialConfig() {
        return this.appConfig.save();
    }

    async updateConfig(id, newConfig) {
        const prop = Object.keys(newConfig)[0];

        await this.appConfig.update(id, { [prop]: newConfig[prop] });

        return this.getConfig();
    }
}
