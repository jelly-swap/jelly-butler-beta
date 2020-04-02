import AppConfig from '../../../config';

import Config from '../../blockchain/config';
import Contracts from '../../blockchain/contracts';
import Adapters from '../../blockchain/adapters';

import { logError } from '../../logger';

export class BalanceService {
    private static Instance: BalanceService;

    private balances = {};

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
            return this.balances;
        } catch (err) {
            logError(`Cannot get balances ${err}`);
            return this.balances;
        }
    }

    getBalances() {
        return this.balances;
    }
}
