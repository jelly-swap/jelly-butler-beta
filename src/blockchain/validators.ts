import * as BitcoinValidator from './bitcoin/validator';
import * as EthereumValidator from './ethereum/validator';
import * as AeternityValidator from './aeternity/validator';
import * as Erc20Validator from './erc20/validator';
import { SECONDARY_NETWORKS } from './config';

const getErc20Validators = () => {
    return Object.keys(SECONDARY_NETWORKS).reduce((object, token) => {
        object[token] = Erc20Validator;
        return object;
    }, {});
};

export default {
    BTC: BitcoinValidator,
    ETH: EthereumValidator,
    AE: AeternityValidator,
    ...getErc20Validators(),
};
