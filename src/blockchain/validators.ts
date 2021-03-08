import * as BitcoinValidator from './bitcoin/validator';
import * as EthereumValidator from './ethereum/validator';
import * as AeternityValidator from './aeternity/validator';
import * as Erc20Validator from './erc20/validator';
import * as HarmonyValidator from './harmony/validator';
import * as MaticValidator from './matic/validator';
import * as AvalancheValidator from './avalanche/validator';
import * as BinanceValidator from './binance/validator';
import * as XinfinValidator from './xinfin/validator';

import { SECONDARY_NETWORKS } from './erc20/config';

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
    ONE: HarmonyValidator,
    MATIC: MaticValidator,
    AVAX: AvalancheValidator,
    BNB: BinanceValidator,
    XDC: XinfinValidator,
    ...getErc20Validators(),
};
