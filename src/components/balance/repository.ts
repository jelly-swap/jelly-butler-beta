import AppConfig from '../../../config';
import Repository from '../../repository';

import { logError } from '../../logger';

export default class BalanceRepository {
    private balanceRepository = Repository[AppConfig.ACTIVE_DB]['balance']();

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
