import axios from 'axios';
import * as moment from 'moment';

import getContracts from '../../blockchain/contracts';

import { BalanceService } from '../balance/service';
import { PriceService } from '../price/service';
import { logError } from '../../logger';
import { IUserConfig } from '../../types/UserConfig';
import UserConfig from '../../config';
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

    private updated;

    constructor() {
        if (InfoService.instance) {
            return InfoService.instance;
        }

        this.userConfig = new UserConfig().getUserConfig();

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
                logError(`CANNOT_CONNECT_TO_NETWORK`, message);
            }
        } catch (err) {
            logError(`REGISTER_ERROR`, err);
        }
    }

    async update() {
        this.prices = this.priceService.getPricesWithSpreadAndFee();
        this.balances = this.balanceService.getBalances();
        this.updated = moment().valueOf();
        await this.getSignatures();
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
                    logError('Cannot sign message', err);
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
                logError(`CANNOT_CONNECT_TO_NETWORK`, message);

                if (message === 'NOT_REGISTERED') {
                    await this.register();
                }
            }
        } catch (err) {
            logError(`I_AM_ALIVE_ERROR`, err);
        }
    }

    getInfo() {
        return {
            name: this.name,
            pairs: this.pairs,
            prices: this.prices,
            balances: this.balances,
            updated: this.updated,
        };
    }
}
