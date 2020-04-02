import { getMongoRepository } from 'typeorm';
import Withdraw from '../../entity/withdraw';

import { logError } from '../../logger';

export default class WithdrawRepository {
    private withdrawRepository = getMongoRepository(Withdraw);

    public async create(withdraw: Withdraw) {
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
