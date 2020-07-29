import getBlockchainConfig from '../../blockchain/config';
import getContracts from '../../blockchain/contracts';
import getAdapters from '../../blockchain/adapters';

import getProvidedAssets from '../../config/providedAssets';
import getSupportedNetworks from '../../config/supportedNetworks';

import Exchange from '../../exchange';
import { add, addBig, toBigNumber, mul } from '../../utils/math';
import { PriceService } from '../../components/price/service';
import BalanceRepository from './repository';

import { logDebug } from '../../logger';
import { safeAccess } from '../../utils';

export class BalanceService {
    private static Instance: BalanceService;

    private exchange = new Exchange();
    private priceService = new PriceService();
    private balanceRepository = new BalanceRepository();

    private blockchainConfig: any;
    private contracts: any;
    private adapters: any;

    private providedBalances = {};
    private allBalances = {};

    private providedAssets: any;
    private allAssets: any;

    private exchangeBalances = {};

    constructor() {
        if (BalanceService.Instance) {
            return BalanceService.Instance;
        }

        this.blockchainConfig = getBlockchainConfig();

        this.contracts = getContracts();
        this.adapters = getAdapters();

        this.providedAssets = getProvidedAssets();
        this.allAssets = getSupportedNetworks();

        BalanceService.Instance = this;
    }

    async update() {
        try {
            for (const network in this.allAssets) {
                try {
                    const address = this.blockchainConfig[network].receiverAddress;
                    const result = await this.contracts[network].getBalance(address, network);
                    const raw = result.toString();
                    const balance = this.adapters[network].parseFromNative(result || 0, network).toString();

                    this.allBalances[network] = { address, raw, balance };

                    if (this.providedAssets[network]) {
                        this.providedBalances[network] = this.allBalances[network];
                    }
                } catch (err) {
                    logDebug(`CANNOT_GET_BALANCES`, { network, err });
                }
            }

            this.exchangeBalances = await this.exchange.getBalance();
        } catch (err) {
            logDebug(`CANNOT_GET_BALANCES`, err);
        }
    }

    async saveBalanceHistory() {
        try {
            let portfolioInUsdcTotal = toBigNumber(0);
            const balances = [];

            for (const network in this.allAssets) {
                try {
                    const jellyBalance = safeAccess(this.allBalances, [network, 'balance']) || 0;
                    const exchangeBalance = safeAccess(this.exchangeBalances, [network, 'balance']) || 0;
                    const pairPrice = this.priceService.getPairPrice(network, 'USDC');
                    const amount = add(jellyBalance, exchangeBalance);
                    const valueInUsdc = mul(pairPrice, amount);

                    balances.push({ assetName: network, amount, valueInUsdc });
                    portfolioInUsdcTotal = addBig(portfolioInUsdcTotal, valueInUsdc);
                } catch (err) {
                    logDebug(`BALANCE_HISTORY_PRICE_${network}-USDC`, err);
                }
            }

            balances.push({
                assetName: 'TOTAL_USDC',
                amount: portfolioInUsdcTotal.toString(),
                valueInUsdc: portfolioInUsdcTotal.toString(),
            });

            this.balanceRepository.saveBalance(balances);
        } catch (err) {
            logDebug(`CANNOT_SAVE_BALANCES`, err);
        }
    }

    getBalances() {
        return this.providedBalances;
    }

    getAllBalances() {
        return this.allBalances;
    }

    getExchangeBalances() {
        return this.exchangeBalances;
    }
}
