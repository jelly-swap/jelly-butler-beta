import { getRepository, In } from 'typeorm';

import Withdraw from '../../entity/sql/withdraw';
import { WithdrawModel } from './model';
import { logDebug } from '../../logger';

export default class WithdrawRepository {
    private withdrawRepository;

    constructor() {
        this.withdrawRepository = getRepository(Withdraw);
    }

    public async create(withdraw: any) {
        try {
            return await this.withdrawRepository.save(
                new WithdrawModel(
                    withdraw.id,
                    withdraw.hashLock,
                    withdraw.secret,
                    withdraw.transactionHash,
                    withdraw.sender,
                    withdraw.receiver,
                    withdraw.network
                )
            );
        } catch (error) {
            logDebug(`WITHDRAW_REPOSITORY_ERROR`, error);
            return error;
        }
    }

    public findByIdAndNetwork(id: string, network: string) {
        return this.withdrawRepository.findOne({ id, network });
    }

    public findManyByIds(ids: string[]) {
        return this.withdrawRepository.find({ where: { id: In(ids) } });
    }
}
