import UserConfig from '.';

export default () => {
    const userConfig = new UserConfig().getUserConfig();

    const pairs = userConfig.PAIRS;

    return Object.keys(pairs).reduce((result, pair) => {
        const asset = pair.split('-')[1];

        if (asset) {
            if (!result[asset]) {
                result[asset] = true;
            }
        }

        return result;
    }, {});
};
