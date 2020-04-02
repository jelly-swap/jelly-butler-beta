import axios from 'axios';
import * as moment from 'moment';

import AppConfig from '../../../config';

import { BalanceService } from '../balance/service';
import { PriceService } from '../price/service';
import { logError } from '../../logger';

export default class InfoService {
    private static instance: InfoService;

    private balanceService: BalanceService;
    private priceService: PriceService;

    private name = AppConfig.NAME;
    private pairs = AppConfig.PAIRS;

    private prices = {};
    private balances = {};

    private updated;

    constructor() {
        if (InfoService.instance) {
            return InfoService.instance;
        }

        this.balanceService = new BalanceService();
        this.priceService = new PriceService();

        InfoService.instance = this;
    }

    async update() {
        this.prices = this.priceService.getPricesWithSpreadAndFee();
        this.balances = this.balanceService.getBalances();
        this.updated = moment().valueOf();
    }

    async iAmAlive() {
        try {
            const info = this.getInfo();

            const result = await axios.post(AppConfig.AGGREGATOR_URL, info);

            const { valid, message } = result?.data;
            if (!valid) {
                logError(`CANNOT_CONNECT_TO_NETWORK: ${message}`);
            }
        } catch (err) {
            logError(`I_AM_ALIVE_ERROR: ${err}`);
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
