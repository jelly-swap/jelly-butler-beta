import AppConfig from '../../../config';
import Repository from '../../repository';
import { safeAccess } from '../../utils';

import { logError } from '../../logger';

export default class BalanceRepository {
    private balanceRepository;

    constructor() {
        const getBalanceRepository = safeAccess(Repository, [AppConfig.ACTIVE_DB, 'balance']);

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
            logError(`Error while saving the Balance: ${error}`);
        }
    }

    public async findAll() {
        return this.balanceRepository.find();
    }
}
