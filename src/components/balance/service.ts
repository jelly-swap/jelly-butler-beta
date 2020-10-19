import getBlockchainConfig from '../../blockchain/config';
import getContracts from '../../blockchain/contracts';
import getAdapters from '../../blockchain/adapters';

import getProvidedAssets from '../../config/providedAssets';
import getSupportedNetworks from '../../config/supportedNetworks';

import { addBig, toBigNumber, mul, greaterThan } from '../../utils/math';
import { PriceService } from '../../components/price/service';
import BalanceRepository from './repository';

import { logDebug, logError } from '../../logger';
import { safeAccess } from '../../utils';
import { SECONDARY_NETWORKS } from '../../blockchain/erc20/config';

export class BalanceService {
    private static Instance: BalanceService;

    private priceService = new PriceService();
    private balanceRepository = new BalanceRepository();

    private blockchainConfig: any;
    private contracts: any;
    private adapters: any;

    private providedBalances = {};
    private allBalances = {};

    private providedAssets: any;
    private allAssets: any;

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
        const erc20Address = {};

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

                    if (SECONDARY_NETWORKS[network]) {
                        if (!erc20Address[address]) {
                            const ethBalance = await this.contracts['ETH'].getBalance(address, network);
                            erc20Address[address] = address;
                            if (!greaterThan(ethBalance, 0)) {
                                logError(
                                    `You need ETH in ${address} for the Ethereum network fees in order to  provide ${network}.`
                                );
                                logError(`Exiting...`);
                                process.exit(-1);
                            }
                        }
                    }
                } catch (err) {
                    logDebug(`CANNOT_GET_BALANCES ${network} ${err}`);
                    logDebug(`CANNOT_GET_BALANCES`, err);
                }
            }
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
                    const amount = safeAccess(this.allBalances, [network, 'balance']) || 0;
                    const pairPrice = this.priceService.getPairPrice(network, 'USDC');
                    const valueInUsdc = mul(pairPrice, amount);

                    balances.push({ assetName: network, amount, valueInUsdc });
                    portfolioInUsdcTotal = addBig(portfolioInUsdcTotal, valueInUsdc);
                } catch (err) {
                    logDebug(`BALANCE_HISTORY_PRICE_${network}-USDC`, err);
                }
            }

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
}
