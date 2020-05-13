import userConfig from '../../user-config';
import { IUserConfig } from '../types/UserConfig';

export default class UserConfig {
    private static instance: UserConfig;

    private config: any;

    constructor() {
        if (UserConfig.instance) {
            return UserConfig.instance;
        }

        this.config = userConfig;

        UserConfig.instance = this;
    }

    setUserConfig(config) {
        this.config = config;
    }

    getUserConfig(): IUserConfig {
        return this.config;
    }
}
