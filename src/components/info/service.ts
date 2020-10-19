import axios from 'axios';
import moment from 'moment';

import UserConfig from '../../config';

import getContracts from '../../blockchain/contracts';
import getSupportedNetworks from '../../config/supportedNetworks';

import { BalanceService } from '../balance/service';
import { PriceService } from '../price/service';
import { logData, logError } from '../../logger';
import { IUserConfig } from '../../types/UserConfig';
import { safeAccess } from '../../utils';

export default class InfoService {
    private static instance: InfoService;

    private userConfig: IUserConfig;

    private balanceService: BalanceService;
    private priceService: PriceService;

    private name: string;
    private pairs = {};

    private prices = {};
    private balances = {};
    private addresses = {};

    private updated;

    constructor() {
        if (InfoService.instance) {
            return InfoService.instance;
        }

        this.userConfig = new UserConfig().getUserConfig();

        this.addresses = this.getAddresses();

        this.name = this.userConfig.NAME;
        this.pairs = this.userConfig.PAIRS;

        this.balanceService = new BalanceService();
        this.priceService = new PriceService();

        InfoService.instance = this;
    }

    async register() {
        try {
            await this.update();

            const info = this.getInfo();

            const result = await axios.post(`${this.userConfig.AGGREGATOR_URL}/register`, info);

            const { valid, message } = result?.data;
            if (!valid) {
                logError(`CANNOT_CONNECT_TO_NETWORK ${message}`);

                if (message === 'DUPLICATE_NAME') {
                    logData(
                        `If that is your Butler name and no one is using it at the moment, please stand still - Butler will reconnect.`
                    );
                }
            }
        } catch (err) {
            logError(`REGISTER_ERROR ${err}`);
        }
    }

    async update() {
        this.prices = this.priceService.getPricesWithSpreadAndFee();
        this.balances = this.balanceService.getBalances();
        this.updated = moment().valueOf();
        await this.getSignatures();
    }

    getAddresses() {
        const allAssets = getSupportedNetworks();
        return Object.keys(allAssets).reduce((result, asset) => {
            const address = safeAccess(this.userConfig, ['WALLETS', asset, 'ADDRESS']);

            if (address) {
                result[asset] = address;
            }

            return result;
        }, {});
    }

    async getSignatures() {
        const contracts = getContracts();
        for (const network of Object.keys(this.balances)) {
            const message = `${this.name} is LP for ${network} at Jelly v0.1 at ${this.updated}`;

            const signMessageFunction = safeAccess(contracts, [network, 'signMessage']);

            if (signMessageFunction) {
                try {
                    const sig = await contracts[network].signMessage(message);
                    this.balances[network]['signature'] = sig;
                } catch (err) {
                    logError(`Cannot sign message for ${network}. ${err}`);
                    logError(
                        `Please make sure you've entered correct Address/Secret pair. This error can happen if you've entered a BTC address and a mnemonic that does not contain it.`
                    );
                    process.exit(-1);
                }
            }
        }
    }

    async iAmAlive() {
        try {
            const info = this.getInfo();

            const result = await axios.post(`${this.userConfig.AGGREGATOR_URL}/update`, info);

            const { valid, message } = result?.data;

            if (!valid) {
                logError(`CANNOT_CONNECT_TO_NETWORK ${message}`);

                if (message === 'NOT_REGISTERED') {
                    await this.register();
                }
            }
        } catch (err) {
            logError(`I_AM_ALIVE_ERROR ${err}`);
        }
    }

    getInfo() {
        return {
            name: this.name,
            pairs: this.pairs,
            prices: this.prices,
            addresses: this.addresses,
            balances: this.balances,
            updated: this.updated,
        };
    }
}
