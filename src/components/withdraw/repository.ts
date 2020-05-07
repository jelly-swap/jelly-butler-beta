import AppConfig from '../../../config';
import Repository from '../../repository';

import { logError } from '../../logger';
import { safeAccess } from '../../utils';
import UserConfig from '../../config';

export default class WithdrawRepository {
    private withdrawRepository;

    constructor() {
        const userConfig = new UserConfig().getUserConfig();

        const getWithdrawRepository = safeAccess(Repository, [userConfig.DATABASE.ACTIVE, 'withdraw']);

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
