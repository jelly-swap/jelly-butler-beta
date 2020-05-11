import getBlockchainConfig from '../../blockchain/config';
import getContracts from '../../blockchain/contracts';
import getAdapters from '../../blockchain/adapters';

import getProvidedAssets from '../../config/providedAssets';

import Exchange from '../../exchange';
import { add, addBig, toBigNumber, mul } from '../../utils/math';
import { PriceService } from '../../components/price/service';
import BalanceRepository from './repository';

import { logError, logInfo } from '../../logger';
import { safeAccess } from '../../utils';

export class BalanceService {
    private static Instance: BalanceService;

    private balances = {};
    private exchangeBalances = {};
    private exchange = new Exchange();
    private priceService = new PriceService();
    private balanceRepository = new BalanceRepository();

    private blockchainConfig: any;
    private contracts: any;
    private adapters: any;
    private assets: any;

    constructor() {
        if (BalanceService.Instance) {
            return BalanceService.Instance;
        }

        this.blockchainConfig = getBlockchainConfig();
        this.contracts = getContracts();
        this.adapters = getAdapters();
        this.assets = getProvidedAssets();

        BalanceService.Instance = this;
    }

    async update() {
        try {
            for (const network in this.assets) {
                try {
                    const address = this.blockchainConfig[network].receiverAddress;

                    const result = await this.contracts[network].getBalance(address, network);

                    const raw = result.toString();

                    const balance = this.adapters[network].parseFromNative(result || 0).toString();

                    this.balances[network] = { address, raw, balance };
                } catch (err) {
                    logError(`Cannot get balances ${network} ${err}`);
                }
            }

            this.exchangeBalances = await this.exchange.getBalance();

            return this.balances;
        } catch (err) {
            logError(`Cannot get balances ${err}`);
            return this.balances;
        }
    }

    async saveBalanceHistory() {
        try {
            let portfolioInUsdcTotal = toBigNumber(0);
            const balances = [];

            for (const network in this.assets) {
                try {
                    const jellyBalance = safeAccess(this.balances, [network, 'balance']) || 0;

                    const exchangeBalance = safeAccess(this.exchangeBalances, [network, 'balance']) || 0;

                    const pairPrice = this.priceService.getPairPrice(network, 'USDC');

                    const amount = add(jellyBalance, exchangeBalance);

                    const valueInUsdc = mul(pairPrice, amount);

                    balances.push({ assetName: network, amount, valueInUsdc });

                    portfolioInUsdcTotal = addBig(portfolioInUsdcTotal, valueInUsdc);
                } catch (err) {
                    logInfo(`Balance History Service Warning - price missing ${network}-USDC  ${err}`);
                }
            }

            balances.push({
                assetName: 'TOTAL_USDC',
                amount: portfolioInUsdcTotal.toString(),
                valueInUsdc: portfolioInUsdcTotal.toString(),
            });

            this.balanceRepository.saveBalance(balances);
        } catch (err) {
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
