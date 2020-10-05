import AppConfigRepository from './repository';

export class AppConfigService {
    private appConfig = new AppConfigRepository();

    async getConfig() {
        const config = await this.appConfig.getConfig();

        if (!config) {
            return this.appConfig.setInitialConfig();
        }

        return config;
    }

    async updateConfig(newConfig) {
        return this.appConfig.updateConfig(newConfig);
    }
}
