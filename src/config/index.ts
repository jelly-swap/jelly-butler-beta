import userConfig from '../../user-config';
import { IUserConfig } from '../types/UserConfig';
import { safeAccess } from '../utils';

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

    getReceivers(assets: string[]) {
        const wallets = safeAccess(this.config, ['WALLETS']);

        return assets.reduce((p, c) => {
            if (wallets[c]) {
                const receiver = wallets[c].ADDRESS;

                if (receiver) {
                    p.push(receiver);
                }
            }

            return p;
        }, []);
    }
}
