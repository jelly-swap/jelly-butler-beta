import { getRepository } from 'typeorm';

import Balance from '../../entity/sql/balance';
import { logDebug } from '../../logger';

export default class BalanceRepository {
    private balanceRepository;

    constructor() {
        this.balanceRepository = getRepository(Balance);
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
