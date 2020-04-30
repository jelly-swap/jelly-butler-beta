import AppConfig from '../../../config';
import Repository from '../../repository';

import { logError } from '../../logger';
import { safeAccess } from '../../utils';

export default class WithdrawRepository {
    private withdrawRepository;

    constructor() {
        const getWithdrawRepository = safeAccess(Repository, [AppConfig.ACTIVE_DB, 'withdraw']);

        if (!getWithdrawRepository) {
            throw new Error('WITHDRAW_REPOSITORY_MISSING');
        } else {
            this.withdrawRepository = getWithdrawRepository();
        }
    }

    public async create(withdraw: any) {
        try {
            await this.withdrawRepository.save(withdraw);
        } catch (error) {
            logError(`Error while saving the Withdraw: ${error}`);
        }
    }

    public async findByIdAndNetwork(id: string, network: string) {
        return this.withdrawRepository.findOne({ id, network });
    }
}
