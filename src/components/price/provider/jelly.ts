import axios from 'axios';

import IPriceProvider from './IPriceProvider';
import UserConfig from '../../../config';

export default class JellyProvider implements IPriceProvider {
    private static instance: JellyProvider;
    private userConfig;

    constructor() {
        if (JellyProvider.instance) {
            return JellyProvider.instance;
        }

        this.userConfig = new UserConfig().getUserConfig();
        JellyProvider.instance = this;
    }

    async getPrices(__quotes, __bases?) {
        const result = await axios.get(`${this.userConfig.JELLY_PRICE_PROVIDER}`);
        return result.data.data;
    }
}
