import { getRepository, In } from 'typeorm';

import Pending from '../../entity/sql/pending';
import { logDebug } from '../../logger';
import { PendingModel } from './model';

export default class PendingRepository {
    private pendingRepository;

    constructor() {
        this.pendingRepository = getRepository(Pending);
    }

    public async create(withdraw: any) {
        try {
            return this.pendingRepository.save(
                new PendingModel(
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

    public findManyByIds(ids) {
        return this.pendingRepository.find({ where: { id: In(ids) } });
    }

    public getAll() {
        return this.pendingRepository.find();
    }
}
