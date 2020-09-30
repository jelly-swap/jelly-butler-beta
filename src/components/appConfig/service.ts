import AppConfigRepository from './repository';

export class AppConfigService {
    private appConfig = new AppConfigRepository();

    async getConfig() {
        const config = await this.appConfig.getConfig();

        if (!config.length) {
            // SAVE ()
            const createdConfig = await this.appConfig.setInitialConfig();

            return createdConfig;
        }

        return config[0];
    }

    async updateConfig(newConfig) {
        const { id, ...rest } = newConfig;

        return this.appConfig.updateConfig(id, rest);
    }
}
