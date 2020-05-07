import UserConfig from '.';

export default () => {
    const userConfig = new UserConfig().getUserConfig();

    const pairs = userConfig.PAIRS;

    return Object.keys(pairs).reduce((result, pair) => {
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
};
