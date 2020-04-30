import AppConfig from '../../../config';

import Config from '../../blockchain/config';
import Contracts from '../../blockchain/contracts';
import Adapters from '../../blockchain/adapters';
import Exchange from '../../exchange';
import { add, toBigNumber, mul } from '../../utils/math';
import { PriceService } from '../../components/price/service';
import BalanceRepository from './repository';

import { logError } from '../../logger';

export class BalanceService {
    private static Instance: BalanceService;

    private balances = {};
    private exchangeBalances = {};
    private exchange = new Exchange();
    private priceService = new PriceService();
    private balanceRepository = new BalanceRepository();

    constructor() {
        if (BalanceService.Instance) {
            return BalanceService.Instance;
        }

        BalanceService.Instance = this;
    }

    async update() {
        try {
            for (const network of Object.keys(AppConfig.NETWORKS)) {
                if (AppConfig.NETWORKS[network]) {
                    const address = Config[network].receiverAddress;

                    const result = await Contracts[network].getBalance(address, network);

                    const raw = result.toString();

                    const balance = Adapters[network].parseFromNative(result || 0).toString();

                    this.balances[network] = { address, raw, balance };
                }
            }

            this.exchangeBalances = await this.exchange.getBalance();
            return this.balances;
        } catch (err) {
            logError(`Cannot get balances ${err}`);
            return this.balances;
        }
    }

    async saveBalanceHistory(){
        try{
            let jellyBalance;
            let exchangeBalance;
            let resultBalance = {};
            let portfolioInDollars;
            for(let network in AppConfig.NETWORKS){
                try{
                    jellyBalance = this.balances[network]? toBigNumber(this.balances[network]['balance']) : 0;
                    exchangeBalance = this.exchangeBalances[network]? toBigNumber(this.exchangeBalances[network]['balance']) : 0;
                    resultBalance[network] = add(jellyBalance, exchangeBalance);
                    portfolioInDollars = add(
                        portfolioInDollars || 0,
                        mul(toBigNumber(this.priceService.getPairPrice(network,'USDC')), toBigNumber(resultBalance[network]))
                    );
                } catch(err) {
                    logError(`Cannot save balance snapshot - price missing ${err}`);
                }
            }

            resultBalance['portfolioInDollars'] = portfolioInDollars;
            this.balanceRepository.saveBalance(resultBalance);
        } catch(err){
            logError(`Cannot save balance snapshot ${err}`);
        }

    }

    getBalances() {
        return this.balances;
    }

    getExchangeBalances() {
        return this.exchangeBalances;
    }
}
