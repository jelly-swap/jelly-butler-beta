import UserConfig from '.';

let SupportedNetworks: any;

export default () => {
    const userConfig = new UserConfig().getUserConfig();

    const pairs = userConfig.PAIRS;

    if (!SupportedNetworks) {
        SupportedNetworks = Object.keys(pairs).reduce((result, pair) => {
            const base = pair.split('-')[0];
            const quote = pair.split('-')[1];

            if (base && quote) {
                if (!result[base]) {
                    result[base] = true;
                }

                if (!result[quote]) {
                    result[quote] = true;
                }
            }

            return result;
        }, {});
    }

    return SupportedNetworks;
};
