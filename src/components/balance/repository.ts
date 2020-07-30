import Repository from '../../repository';
import { safeAccess } from '../../utils';

import { logDebug } from '../../logger';
import UserConfig from '../../config';

export default class BalanceRepository {
    private balanceRepository;

    constructor() {
        const userConfig = new UserConfig().getUserConfig();

        const getBalanceRepository = safeAccess(Repository, [userConfig.DATABASE.ACTIVE, 'balance']);

        if (!getBalanceRepository) {
            throw new Error('BALANCE_REPOSITORY_MISSING');
        } else {
            this.balanceRepository = getBalanceRepository();
        }
    }

    public async saveBalance(balance: any) {
        try {
            await this.balanceRepository.save(balance);
        } catch (error) {
            logDebug(`BALANCE_REPOSITORY_ERROR`, error);
        }
    }

    public async findAll() {
        return this.balanceRepository.find();
    }
}
