import * as BitcoinValidator from './bitcoin/validator';
import * as EthereumValidator from './ethereum/validator';
import * as AeternityValidator from './aeternity/validator';
import * as Erc20Validator from './erc20/validator';
import * as TronValidator from './tron/validator';

export default {
    BTC: BitcoinValidator,
    ETH: EthereumValidator,
    AE: AeternityValidator,
    DAI: Erc20Validator,
    WBTC: Erc20Validator,
    USDC: Erc20Validator,
    TRX: TronValidator,
};
